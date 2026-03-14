import asyncio
import inspect
import io
import mimetypes
import os
import typing

from PIL import Image
from loguru import logger
from pathlib import Path
from uuid import uuid4

from boto3 import session
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import UploadFile, HTTPException


def _guess_extension(filename: str, content_type: str | None) -> str:
    extension = Path(filename).suffix
    if extension:
        return extension

    guessed = mimetypes.guess_extension(content_type or "")
    return guessed or ".bin"


async def _upload_to_spaces(
    file_data: bytes | bytearray | memoryview | UploadFile | typing.Awaitable[bytes],
    s3_client: typing.Any,
    bucket_name: str,
    region: str,
    *,
    filename: str | None = None,
    content_type: str | None = None,
) -> str:
    if isinstance(file_data, UploadFile):
        resolved_filename = file_data.filename or filename or "image.jpg"
        resolved_content_type = file_data.content_type or content_type
        data = await file_data.read()
    else:
        resolved_filename = filename or "result.png"
        resolved_content_type = content_type
        if inspect.isawaitable(file_data):
            file_data = await file_data
        if isinstance(file_data, memoryview):
            data = file_data.tobytes()
        elif isinstance(file_data, bytearray):
            data = bytes(file_data)
        elif isinstance(file_data, bytes):
            data = file_data
        else:
            raise HTTPException(status_code=500, detail="Upload payload must be bytes, UploadFile, or awaitable bytes")

    logger.info(f"Uploading '{resolved_filename}' to Spaces")

    if not data:
        raise HTTPException(status_code=400, detail=f"File '{resolved_filename}' is empty")

    resolved_content_type = (
        resolved_content_type
        or mimetypes.guess_type(resolved_filename)[0]
        or "application/octet-stream"
    )
    extension = _guess_extension(resolved_filename, resolved_content_type)
    key = f"try-on/{uuid4().hex}{extension}"

    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=data,
            ACL="public-read",
            ContentType=resolved_content_type,
        )
    except (BotoCoreError, ClientError) as exc:
        logger.error(f"{exc.__class__.__name__!r}: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to upload '{resolved_filename}' to Spaces") from exc

    return f"https://{bucket_name}.{region}.cdn.digitaloceanspaces.com/{bucket_name}/{key}"

def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(status_code=500, detail=f"Missing required env var: {name}")
    return value


def _build_spaces_client():
    access_key = _required_env("DO_ACCESS_KEY_ID")
    secret_key = _required_env("DO_SECRET_ACCESS_KEY")
    region = os.getenv("DO_REGION_NAME", "fra1")
    endpoint_url = os.getenv("DO_S3_ENDPOINT_URL", f"https://{region}.digitaloceanspaces.com")

    return (
        session.Session().client(
            "s3",
            region_name=region,
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version="s3v4"),
        ),
        region,
    )


def _compress_image_sync(image_bytes: bytes, max_size: int = 1024, quality: int = 85) -> bytes:
    with Image.open(io.BytesIO(image_bytes)) as img:
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=quality)
        return output.getvalue()

async def compress_image_async(image_bytes: bytes, max_size: int = 1024, quality: int = 85) -> bytes:
    return await asyncio.to_thread(_compress_image_sync, image_bytes, max_size, quality)
