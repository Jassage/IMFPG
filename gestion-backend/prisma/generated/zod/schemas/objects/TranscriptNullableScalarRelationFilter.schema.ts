import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema'

export const TranscriptNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TranscriptNullableScalarRelationFilter, z.ZodTypeDef, Prisma.TranscriptNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => TranscriptWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => TranscriptWhereInputObjectSchema).nullish()
}).strict();
export const TranscriptNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => TranscriptWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => TranscriptWhereInputObjectSchema).nullish()
}).strict();
