import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianCreateManyStudentInputObjectSchema } from './GuardianCreateManyStudentInput.schema'

export const GuardianCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.GuardianCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.GuardianCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GuardianCreateManyStudentInputObjectSchema), z.lazy(() => GuardianCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GuardianCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GuardianCreateManyStudentInputObjectSchema), z.lazy(() => GuardianCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
