import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1).max(50),
  email: z.email(),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 100 charachters" })
    .max(100),
  profileImage: z
    .any()
    .optional()
    .transform((value) => {
      if (value && typeof value === "object" && "item" in value && value.length > 0) {
        return value[0]; // extract first File
      }
      return undefined;
    })
    .refine((file) => !file || file instanceof File, "Invalid file")
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "Image must be under 2MB"
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG or WEBP allowed"
    ),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
