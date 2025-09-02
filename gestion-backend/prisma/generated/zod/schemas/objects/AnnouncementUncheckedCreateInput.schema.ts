import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInput.schema'

export const AnnouncementUncheckedCreateInputObjectSchema: z.ZodType<Prisma.AnnouncementUncheckedCreateInput, z.ZodTypeDef, Prisma.AnnouncementUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional(),
  attachments: z.lazy(() => AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInputObjectSchema).optional()
}).strict();
export const AnnouncementUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional(),
  attachments: z.lazy(() => AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInputObjectSchema).optional()
}).strict();
