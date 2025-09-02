import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateManyStudentInputObjectSchema } from './PaymentCreateManyStudentInput.schema'

export const PaymentCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.PaymentCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.PaymentCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => PaymentCreateManyStudentInputObjectSchema), z.lazy(() => PaymentCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PaymentCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => PaymentCreateManyStudentInputObjectSchema), z.lazy(() => PaymentCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
