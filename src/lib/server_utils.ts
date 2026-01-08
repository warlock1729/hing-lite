import fs from "fs/promises";
import path from "path"

export async function saveAvatar(file: File,filename:string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

 
  const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
  const filePath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return `/uploads/avatars/${filename}`;
}
