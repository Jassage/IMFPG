import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementArgsObjectSchema } from './AnnouncementArgs.schema'

export const AnnouncementAttachmentSelectObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentSelect, z.ZodTypeDef, Prisma.AnnouncementAttachmentSelect> = z.object({
  id: z.boolean().optional(),
  announcementId: z.boolean().optional(),
  announcement: z.union([z.boolean(), z.lazy(() => AnnouncementArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();
export const AnnouncementAttachmentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  announcementId: z.boolean().optional(),
  announcement: z.union([z.boolean(), z.lazy(() => AnnouncementArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();
