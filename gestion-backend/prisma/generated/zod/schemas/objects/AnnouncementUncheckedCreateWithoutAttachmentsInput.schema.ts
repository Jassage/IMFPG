import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.AnnouncementUncheckedCreateWithoutAttachmentsInput, z.ZodTypeDef, Prisma.AnnouncementUncheckedCreateWithoutAttachmentsInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional()
}).strict();
export const AnnouncementUncheckedCreateWithoutAttachmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional()
}).strict();
