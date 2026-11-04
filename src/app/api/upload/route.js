const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "IMGBB_API_KEY is not configured. Add it to .env and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Expected multipart/form-data with an image file." },
      { status: 400 },
    );
  }

  const file = formData.get("image");

  if (!(file instanceof File)) {
    return Response.json({ error: "No image file was provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "The uploaded file must be an image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json(
      { error: "The image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const upload = new FormData();
  upload.append("image", file, file.name || "cover.jpg");

  try {
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${apiKey}`, {
      method: "POST",
      body: upload,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success || !data?.data) {
      return Response.json(
        {
          error:
            data?.error?.message ||
            "imgbb rejected the upload. Check your API key and try again.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      url: data.data.display_url || data.data.url,
      deleteUrl: data.data.delete_url ?? null,
    });
  } catch (error) {
    console.error("Image upload failed:", error);

    return Response.json(
      { error: "Could not reach imgbb. Try again in a moment." },
      { status: 502 },
    );
  }
}
