import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentCreateManyInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateManyInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateManyInput> = z.object({
  id: z.string().optional(),
  announcementId: z.string(),
  url: z.string()
}).strict();
export const AnnouncementAttachmentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  announcementId: z.string(),
  url: z.string()
}).strict();
