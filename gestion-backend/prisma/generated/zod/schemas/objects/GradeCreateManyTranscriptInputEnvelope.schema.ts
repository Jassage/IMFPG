import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateManyTranscriptInputObjectSchema } from './GradeCreateManyTranscriptInput.schema'

export const GradeCreateManyTranscriptInputEnvelopeObjectSchema: z.ZodType<Prisma.GradeCreateManyTranscriptInputEnvelope, z.ZodTypeDef, Prisma.GradeCreateManyTranscriptInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GradeCreateManyTranscriptInputObjectSchema), z.lazy(() => GradeCreateManyTranscriptInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GradeCreateManyTranscriptInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GradeCreateManyTranscriptInputObjectSchema), z.lazy(() => GradeCreateManyTranscriptInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
