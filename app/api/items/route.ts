import { put } from "@vercel/blob";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/http";

// GET /api/items            -> all items, newest first (Home Feed)
// GET /api/items?mine=true  -> only the caller's items (My Posts)
export async function GET(req: Request) {
  try {
    const user = await getUser(req);
    const mine = new URL(req.url).searchParams.get("mine") === "true";

    const items = await prisma.item.findMany({
      where: mine ? { ownerId: user.id } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return ok(items);
  } catch (e) {
    return handleError(e);
  }
}

// POST /api/items  (multipart/form-data)
// fields: title, description, location, contactInfo, image (file)
export async function POST(req: Request) {
  try {
    const user = await getUser(req);
    const form = await req.formData();

    const title = (form.get("title") as string | null)?.trim() ?? "";
    const description = (form.get("description") as string | null)?.trim() ?? "";
    const location = (form.get("location") as string | null)?.trim() ?? "";
    const contactInfo = (form.get("contactInfo") as string | null)?.trim() ?? "";
    const image = form.get("image");

    if (!title) return fail("Title is required");
    if (!description) return fail("Description is required");
    if (!location) return fail("Location is required");
    if (!contactInfo) return fail("Contact information is required");
    if (!(image instanceof File) || image.size === 0) return fail("Image is required");

    const blob = await put(`items/${Date.now()}.jpg`, image, {
      access: "public",
      addRandomSuffix: true,
      contentType: image.type || "image/jpeg",
    });

    const item = await prisma.item.create({
      data: {
        title,
        description,
        location,
        contactInfo,
        imageUrl: blob.url,
        ownerId: user.id, // taken from the verified token, never from the client
        ownerName: user.name,
        ownerEmail: user.email,
      },
    });

    return ok(item, 201);
  } catch (e) {
    return handleError(e);
  }
}
