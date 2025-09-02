import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema';
import { PaymentUpdateManyMutationInputObjectSchema } from './PaymentUpdateManyMutationInput.schema';
import { PaymentUncheckedUpdateManyWithoutStudentInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutStudentInput.schema'

export const PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const PaymentUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
