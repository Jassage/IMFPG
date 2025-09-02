import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCreateManyStudentInputObjectSchema } from './TranscriptCreateManyStudentInput.schema'

export const TranscriptCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.TranscriptCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.TranscriptCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => TranscriptCreateManyStudentInputObjectSchema), z.lazy(() => TranscriptCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TranscriptCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => TranscriptCreateManyStudentInputObjectSchema), z.lazy(() => TranscriptCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
