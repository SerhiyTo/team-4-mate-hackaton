import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/** File metadata (browser does not expose real file path) */
export type FileInfo = {
  name: string;
  size: number;
  type: string;
  last_modified: number;
};

type FormValues = {
  // Block 1 – body
  body_image: FileList | null;
  body_height: number;
  body_waist: number;
  body_shoulder_width: number;
  body_arm_length: number;
  // Block 2 – cloth
  cloth_image: FileList | null;
  cloth_length: number;
  cloth_waist: number;
  cloth_shoulder_width: number;
  cloth_sleeve_length: number;
};

/** Form payload with file fields as FileInfo instead of FileList */
export type DemoSubmitPayload = Omit<
  FormValues,
  "body_image" | "cloth_image"
> & {
  body_image: FileInfo | null;
  cloth_image: FileInfo | null;
};

function fileListToFileInfo(list: FileList | null): FileInfo | null {
  const file = list?.item(0);
  if (!file) return null;
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    last_modified: file.lastModified,
  };
}

/** Build FormData for multipart/form-data submit (images as files + other fields as strings) */
function formValuesToFormData(data: FormValues): FormData {
  const formData = new FormData();

  const bodyFile = data.body_image?.item(0);
  if (bodyFile) {
    formData.append("file_user", bodyFile, bodyFile.name);
  }

  const clothFile = data.cloth_image?.item(0);
  if (clothFile) {
    formData.append("file_clothes", clothFile, clothFile.name);
  }

  const appendNum = (key: string, value: number) => {
    formData.append(key, Number.isFinite(value) ? String(value) : "");
  };
  appendNum("body_height", data.body_height);
  appendNum("body_waist", data.body_waist);
  appendNum("body_shoulder_width", data.body_shoulder_width);
  appendNum("body_arm_length", data.body_arm_length);
  appendNum("cloth_length", data.cloth_length);
  appendNum("cloth_waist", data.cloth_waist);
  appendNum("cloth_shoulder_width", data.cloth_shoulder_width);
  appendNum("cloth_sleeve_length", data.cloth_sleeve_length);

  return formData;
}

function InputBlock({
  label,
  id,
  error,
  ...inputProps
}: {
  label: string;
  id: string;
  error?: { message?: string };
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step="any"
        className="max-w-50 rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        {...inputProps}
      />
      {error?.message && (
        <span className="text-sm text-red-600">{error.message}</span>
      )}
    </div>
  );
}

export function Demo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      body_height: 0,
      body_waist: 0,
      body_shoulder_width: 0,
      body_arm_length: 0,
      cloth_length: 0,
      cloth_waist: 0,
      cloth_shoulder_width: 0,
      cloth_sleeve_length: 0,
    },
  });

  const [bodyPreviewUrl, setBodyPreviewUrl] = useState<string | null>(null);
  const [clothPreviewUrl, setClothPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (bodyPreviewUrl) URL.revokeObjectURL(bodyPreviewUrl);
      if (clothPreviewUrl) URL.revokeObjectURL(clothPreviewUrl);
    };
  }, [bodyPreviewUrl, clothPreviewUrl]);

  const bodyImageRegister = register("body_image");
  const clothImageRegister = register("cloth_image");

  const onBodyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    bodyImageRegister.onChange(e);
    const file = e.target.files?.[0];
    setBodyPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const onClothImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clothImageRegister.onChange(e);
    const file = e.target.files?.[0];
    setClothPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const formData = formValuesToFormData(data);
      if (import.meta.env.DEV) {
        console.log("Payload (metadata)", {
          ...data,
          body_image: fileListToFileInfo(data.body_image),
          cloth_image: fileListToFileInfo(data.cloth_image),
        });
      }

      const apiUrl = "https://b765-91-90-18-78.ngrok-free.app/try-on";
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        // Do not set Content-Type: fetch will set multipart/form-data with boundary
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      console.log("API response", result);
      setResultImageUrl(
        result.result_url ?? result.image_url ?? result.imageUrl ?? null
      );
      setModalOpen(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="result-modal-title"
                className="text-lg font-semibold text-neutral-900"
              >
                Result
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <div className="mt-4 flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              {resultImageUrl ? (
                <img
                  src={resultImageUrl}
                  alt="Try-on result"
                  className="max-h-96 w-full object-contain"
                />
              ) : (
                <p className="text-sm text-neutral-500">
                  Image will appear here when returned from API
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold">Try on AI</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Block 1 – Body measurements */}
          <div className="min-w-0 space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Your body
            </h2>
            <div className="flex flex-row gap-6">
              <div className="flex shrink-0 flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Image
                </label>
                <div className="flex min-h-80 w-72 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                  {bodyPreviewUrl ? (
                    <img
                      src={bodyPreviewUrl}
                      alt="Body preview"
                      className="h-full max-h-96 w-full object-contain object-center"
                    />
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center text-sm text-neutral-500">
                      <span>Choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...bodyImageRegister}
                        onChange={onBodyImageChange}
                      />
                    </label>
                  )}
                </div>
                {bodyPreviewUrl && (
                  <input
                    type="file"
                    accept="image/*"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700 cursor-pointer"
                    {...bodyImageRegister}
                    onChange={onBodyImageChange}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 flex flex-col gap-4">
                <InputBlock
                  label="Your height (cm)"
                  id="body_height"
                  error={errors.body_height}
                  {...register("body_height", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Waist circumference (cm)"
                  id="body_waist"
                  error={errors.body_waist}
                  {...register("body_waist", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Shoulder width (cm)"
                  id="body_shoulder_width"
                  error={errors.body_shoulder_width}
                  {...register("body_shoulder_width", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Arm length from shoulder to wrist (cm)"
                  id="body_arm_length"
                  error={errors.body_arm_length}
                  {...register("body_arm_length", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Block 2 – Cloth measurements */}
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 min-w-0">
            <h2 className="text-lg font-semibold text-neutral-900">Cloth</h2>
            <div className="flex flex-row gap-6">
              <div className="flex shrink-0 flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Image
                </label>
                <div className="flex min-h-80 w-72 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                  {clothPreviewUrl ? (
                    <img
                      src={clothPreviewUrl}
                      alt="Cloth preview"
                      className="h-full max-h-96 w-full object-contain object-center"
                    />
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 p-4 text-center text-sm text-neutral-500">
                      <span>Choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...clothImageRegister}
                        onChange={onClothImageChange}
                      />
                    </label>
                  )}
                </div>
                {clothPreviewUrl && (
                  <input
                    type="file"
                    accept="image/*"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700 cursor-pointer"
                    {...clothImageRegister}
                    onChange={onClothImageChange}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 flex flex-col gap-4">
                <InputBlock
                  label="Cloth length (cm)"
                  id="cloth_length"
                  error={errors.cloth_length}
                  {...register("cloth_length", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Waist circumference (cm)"
                  id="cloth_waist"
                  error={errors.cloth_waist}
                  {...register("cloth_waist", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Shoulder width (cm)"
                  id="cloth_shoulder_width"
                  error={errors.cloth_shoulder_width}
                  {...register("cloth_shoulder_width", { valueAsNumber: true })}
                />
                <InputBlock
                  label="Sleeve length (cm)"
                  id="cloth_sleeve_length"
                  error={errors.cloth_sleeve_length}
                  {...register("cloth_sleeve_length", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
