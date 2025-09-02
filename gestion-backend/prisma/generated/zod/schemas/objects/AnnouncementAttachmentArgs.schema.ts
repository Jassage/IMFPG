import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentSelectObjectSchema } from './AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentIncludeObjectSchema } from './AnnouncementAttachmentInclude.schema'

export const AnnouncementAttachmentArgsObjectSchema = z.object({
  select: z.lazy(() => AnnouncementAttachmentSelectObjectSchema).optional(),
  include: z.lazy(() => AnnouncementAttachmentIncludeObjectSchema).optional()
}).strict();
export const AnnouncementAttachmentArgsObjectZodSchema = z.object({
  select: z.lazy(() => AnnouncementAttachmentSelectObjectSchema).optional(),
  include: z.lazy(() => AnnouncementAttachmentIncludeObjectSchema).optional()
}).strict();
