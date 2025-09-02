import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateManyAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateManyAnnouncementInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const AnnouncementAttachmentCreateManyAnnouncementInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
