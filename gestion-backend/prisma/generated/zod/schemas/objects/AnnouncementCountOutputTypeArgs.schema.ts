import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementCountOutputTypeSelectObjectSchema } from './AnnouncementCountOutputTypeSelect.schema'

export const AnnouncementCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => AnnouncementCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const AnnouncementCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => AnnouncementCountOutputTypeSelectObjectSchema).optional()
}).strict();
