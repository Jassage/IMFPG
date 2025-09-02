import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementArgsObjectSchema } from './AnnouncementArgs.schema'

export const AnnouncementAttachmentIncludeObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentInclude, z.ZodTypeDef, Prisma.AnnouncementAttachmentInclude> = z.object({
  announcement: z.union([z.boolean(), z.lazy(() => AnnouncementArgsObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentIncludeObjectZodSchema = z.object({
  announcement: z.union([z.boolean(), z.lazy(() => AnnouncementArgsObjectSchema)]).optional()
}).strict();
