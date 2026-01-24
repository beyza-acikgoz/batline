// /api/upload/route.ts
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadPath = path.join(
    process.cwd(),
    "public/uploads",
    file.name
  );

  await writeFile(uploadPath, buffer);

  return Response.json({
    url: `/uploads/${file.name}`
  });
}
