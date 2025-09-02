import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateWithoutAnnouncementInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const AnnouncementAttachmentCreateWithoutAnnouncementInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
