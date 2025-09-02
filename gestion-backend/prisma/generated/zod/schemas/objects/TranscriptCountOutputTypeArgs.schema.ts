import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCountOutputTypeSelectObjectSchema } from './TranscriptCountOutputTypeSelect.schema'

export const TranscriptCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => TranscriptCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TranscriptCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => TranscriptCountOutputTypeSelectObjectSchema).optional()
}).strict();
