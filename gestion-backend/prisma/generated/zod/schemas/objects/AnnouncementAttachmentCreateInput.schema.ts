import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementCreateNestedOneWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateNestedOneWithoutAttachmentsInput.schema'

export const AnnouncementAttachmentCreateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateInput> = z.object({
  id: z.string().optional(),
  url: z.string(),
  announcement: z.lazy(() => AnnouncementCreateNestedOneWithoutAttachmentsInputObjectSchema)
}).strict();
export const AnnouncementAttachmentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  announcement: z.lazy(() => AnnouncementCreateNestedOneWithoutAttachmentsInputObjectSchema)
}).strict();
