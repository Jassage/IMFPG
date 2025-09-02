import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedCreateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  announcementId: z.string(),
  url: z.string()
}).strict();
export const AnnouncementAttachmentUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  announcementId: z.string(),
  url: z.string()
}).strict();
