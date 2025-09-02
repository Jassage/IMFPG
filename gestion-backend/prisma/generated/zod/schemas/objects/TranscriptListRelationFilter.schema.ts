import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema'

export const TranscriptListRelationFilterObjectSchema: z.ZodType<Prisma.TranscriptListRelationFilter, z.ZodTypeDef, Prisma.TranscriptListRelationFilter> = z.object({
  every: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  some: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  none: z.lazy(() => TranscriptWhereInputObjectSchema).optional()
}).strict();
export const TranscriptListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  some: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  none: z.lazy(() => TranscriptWhereInputObjectSchema).optional()
}).strict();
