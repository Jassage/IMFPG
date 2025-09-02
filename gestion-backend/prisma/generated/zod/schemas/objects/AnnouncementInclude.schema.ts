import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentFindManySchema } from '../findManyAnnouncementAttachment.schema';
import { AnnouncementCountOutputTypeArgsObjectSchema } from './AnnouncementCountOutputTypeArgs.schema'

export const AnnouncementIncludeObjectSchema: z.ZodType<Prisma.AnnouncementInclude, z.ZodTypeDef, Prisma.AnnouncementInclude> = z.object({
  attachments: z.union([z.boolean(), z.lazy(() => AnnouncementAttachmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AnnouncementCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AnnouncementIncludeObjectZodSchema = z.object({
  attachments: z.union([z.boolean(), z.lazy(() => AnnouncementAttachmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AnnouncementCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
