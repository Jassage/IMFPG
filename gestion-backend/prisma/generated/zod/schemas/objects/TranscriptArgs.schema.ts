import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptSelectObjectSchema } from './TranscriptSelect.schema';
import { TranscriptIncludeObjectSchema } from './TranscriptInclude.schema'

export const TranscriptArgsObjectSchema = z.object({
  select: z.lazy(() => TranscriptSelectObjectSchema).optional(),
  include: z.lazy(() => TranscriptIncludeObjectSchema).optional()
}).strict();
export const TranscriptArgsObjectZodSchema = z.object({
  select: z.lazy(() => TranscriptSelectObjectSchema).optional(),
  include: z.lazy(() => TranscriptIncludeObjectSchema).optional()
}).strict();
