import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentFindManySchema } from '../findManyAnnouncementAttachment.schema';
import { AnnouncementCountOutputTypeArgsObjectSchema } from './AnnouncementCountOutputTypeArgs.schema'

export const AnnouncementSelectObjectSchema: z.ZodType<Prisma.AnnouncementSelect, z.ZodTypeDef, Prisma.AnnouncementSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  content: z.boolean().optional(),
  authorId: z.boolean().optional(),
  publishDate: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  targetAudience: z.boolean().optional(),
  priority: z.boolean().optional(),
  attachments: z.union([z.boolean(), z.lazy(() => AnnouncementAttachmentFindManySchema)]).optional(),
  isActive: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => AnnouncementCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AnnouncementSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  content: z.boolean().optional(),
  authorId: z.boolean().optional(),
  publishDate: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  targetAudience: z.boolean().optional(),
  priority: z.boolean().optional(),
  attachments: z.union([z.boolean(), z.lazy(() => AnnouncementAttachmentFindManySchema)]).optional(),
  isActive: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => AnnouncementCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
