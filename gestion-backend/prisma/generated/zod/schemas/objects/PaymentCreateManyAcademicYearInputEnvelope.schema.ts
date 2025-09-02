import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateManyAcademicYearInputObjectSchema } from './PaymentCreateManyAcademicYearInput.schema'

export const PaymentCreateManyAcademicYearInputEnvelopeObjectSchema: z.ZodType<Prisma.PaymentCreateManyAcademicYearInputEnvelope, z.ZodTypeDef, Prisma.PaymentCreateManyAcademicYearInputEnvelope> = z.object({
  data: z.union([z.lazy(() => PaymentCreateManyAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PaymentCreateManyAcademicYearInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => PaymentCreateManyAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
