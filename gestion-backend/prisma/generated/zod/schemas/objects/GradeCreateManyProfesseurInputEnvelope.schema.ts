import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateManyProfesseurInputObjectSchema } from './GradeCreateManyProfesseurInput.schema'

export const GradeCreateManyProfesseurInputEnvelopeObjectSchema: z.ZodType<Prisma.GradeCreateManyProfesseurInputEnvelope, z.ZodTypeDef, Prisma.GradeCreateManyProfesseurInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GradeCreateManyProfesseurInputObjectSchema), z.lazy(() => GradeCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GradeCreateManyProfesseurInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GradeCreateManyProfesseurInputObjectSchema), z.lazy(() => GradeCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
