import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentCreateNestedManyWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateNestedManyWithoutAnnouncementInput.schema'

export const AnnouncementCreateInputObjectSchema: z.ZodType<Prisma.AnnouncementCreateInput, z.ZodTypeDef, Prisma.AnnouncementCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional(),
  attachments: z.lazy(() => AnnouncementAttachmentCreateNestedManyWithoutAnnouncementInputObjectSchema).optional()
}).strict();
export const AnnouncementCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional(),
  attachments: z.lazy(() => AnnouncementAttachmentCreateNestedManyWithoutAnnouncementInputObjectSchema).optional()
}).strict();
