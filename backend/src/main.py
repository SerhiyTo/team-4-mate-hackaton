import asyncio
import mimetypes
import os
import typing
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from google import genai
from google.genai import types
from fastapi import FastAPI, HTTPException, UploadFile, Depends
import uvicorn
from loguru import logger
from starlette.middleware.cors import CORSMiddleware

from src.schemas import DataParam
from src.services import _build_spaces_client, _upload_to_spaces, _required_env, compress_image_async

gemini_client: genai.Client = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global gemini_client
    api_key = _required_any_env("GEMINI_API_KEY", "GOOGLE_API_KEY")
    gemini_client = genai.Client(api_key=api_key)
    yield
    if hasattr(gemini_client.aio, "aclose"):
        await gemini_client.aio.aclose()


load_dotenv()
app = FastAPI(
    title="TryOn API",
    description="API for trying on clothes using AI",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AnyJSON = typing.Dict[str, typing.Any]


def _required_any_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    raise HTTPException(status_code=500, detail=f"Missing required env var. Expected one of: {', '.join(names)}")


async def _read_image_upload(file: UploadFile, default_filename: str) -> tuple[bytes, str, str]:
    filename = file.filename or default_filename
    content_type = file.content_type or mimetypes.guess_type(filename)[0] or "image/jpeg"
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"File '{filename}' must be an image")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail=f"File '{filename}' is empty")

    return data, filename, content_type


def _extract_generated_image(response: types.EditImageResponse) -> tuple[bytes, str]:
    generated_images = response.generated_images or []
    if not generated_images:
        raise HTTPException(status_code=502, detail="Gemini returned no generated images")

    image = generated_images[0].image
    if not image or not image.image_bytes:
        raise HTTPException(status_code=502, detail="Gemini response does not contain image bytes")

    return image.image_bytes, image.mime_type or "image/png"


@app.post("/try-on")
async def try_on(file_user: UploadFile, file_clothes: UploadFile, param: DataParam = Depends(DataParam.as_form)) -> AnyJSON:
    bucket_name = _required_env("DO_STORAGE_BUCKET_NAME")

    user_bytes = await file_user.read()
    clothes_bytes = await file_clothes.read()
    user_bytes_compressed, clothes_bytes_compressed = await asyncio.gather(
        compress_image_async(user_bytes, max_size=1024),
        compress_image_async(clothes_bytes, max_size=1024)
    )
    s3_client, region = _build_spaces_client()

    user_part = types.Part.from_bytes(
        data=user_bytes_compressed,
        mime_type="image/jpeg"
    )
    clothes_part = types.Part.from_bytes(
        data=clothes_bytes_compressed,
        mime_type="image/jpeg"
    )
    prompt = (
        f"Use reference image 1 as the base photo. Keep the same person, face, body proportions, pose, hair, "
        f"skin tone, camera angle, and background. "
        f"Use reference image 2 only as the clothing reference and remember this people dimensions: {param.body_waist=}, {param.body_height=}, {param.body_arm_length=}, {param.body_shoulder_width=}. "
        f"Dress the person from image 1 in the garment from image 2, preserving garment category, color, pattern, "
        f"material, logos, sleeves, collar, and overall fit. "
        f"Remember about clothers dimensions: {param.cloth_length=}, {param.cloth_waist=}, {param.cloth_shoulder_width=}, {param.cloth_sleeve_length=}."
        f" Return one realistic merged fashion photo."
    )

    try:
        response = await gemini_client.aio.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
            contents=[prompt, user_part, clothes_part],
        )
        generated_part = response.candidates[0].content.parts[0]
        image_bytes = generated_part.inline_data.data
        result_url = await _upload_to_spaces(
            file_data=image_bytes,
            s3_client=s3_client,
            bucket_name=bucket_name,
            region=region,
            content_type="image/png"
        )
        return {
            "success": True,
            "result_url": result_url,
        }
    except HTTPException as exc:
        logger.error(f"{exc.__class__.__name__}: {exc}")
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc.detail}") from exc
    except Exception as exc:
        logger.error(f"{exc.__class__.__name__}: {exc}")
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc


if __name__ == "__main__":
    uvicorn.run(
        app="src.main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", "8000")),
        reload=True,
    )
