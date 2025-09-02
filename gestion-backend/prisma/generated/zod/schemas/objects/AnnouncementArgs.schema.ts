import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementSelectObjectSchema } from './AnnouncementSelect.schema';
import { AnnouncementIncludeObjectSchema } from './AnnouncementInclude.schema'

export const AnnouncementArgsObjectSchema = z.object({
  select: z.lazy(() => AnnouncementSelectObjectSchema).optional(),
  include: z.lazy(() => AnnouncementIncludeObjectSchema).optional()
}).strict();
export const AnnouncementArgsObjectZodSchema = z.object({
  select: z.lazy(() => AnnouncementSelectObjectSchema).optional(),
  include: z.lazy(() => AnnouncementIncludeObjectSchema).optional()
}).strict();
