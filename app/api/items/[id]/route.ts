import { put, del } from "@vercel/blob";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/http";

// In Next.js 15, dynamic route params are async.
type Ctx = { params: Promise<{ id: string }> };

// GET /api/items/{id}  -> item detail
export async function GET(req: Request, { params }: Ctx) {
  try {
    await getUser(req);
    const { id } = await params;

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return fail("Item not found", 404);

    return ok(item);
  } catch (e) {
    return handleError(e);
  }
}

// PUT /api/items/{id}  (multipart/form-data) -> update, owner only
// Any field omitted keeps its current value. `image` is optional on update.
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const user = await getUser(req);
    const { id } = await params;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return fail("Item not found", 404);
    if (existing.ownerId !== user.id) return fail("Not allowed", 403);

    const form = await req.formData();
    const title = (form.get("title") as string | null)?.trim() || existing.title;
    const description = (form.get("description") as string | null)?.trim() || existing.description;
    const location = (form.get("location") as string | null)?.trim() || existing.location;
    const contactInfo = (form.get("contactInfo") as string | null)?.trim() || existing.contactInfo;

    let imageUrl = existing.imageUrl;
    const image = form.get("image");
    if (image instanceof File && image.size > 0) {
      const blob = await put(`items/${Date.now()}.jpg`, image, {
        access: "public",
        addRandomSuffix: true,
        contentType: image.type || "image/jpeg",
      });
      imageUrl = blob.url;
      // best-effort: drop the old image so the bucket doesn't grow forever
      try {
        await del(existing.imageUrl);
      } catch {
        /* ignore */
      }
    }

    const item = await prisma.item.update({
      where: { id },
      data: { title, description, location, contactInfo, imageUrl },
    });

    return ok(item);
  } catch (e) {
    return handleError(e);
  }
}

// DELETE /api/items/{id}  -> owner only, also removes the blob
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const user = await getUser(req);
    const { id } = await params;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return fail("Item not found", 404);
    if (existing.ownerId !== user.id) return fail("Not allowed", 403);

    try {
      await del(existing.imageUrl);
    } catch {
      /* ignore blob delete failures */
    }

    await prisma.item.delete({ where: { id } });
    return ok({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
