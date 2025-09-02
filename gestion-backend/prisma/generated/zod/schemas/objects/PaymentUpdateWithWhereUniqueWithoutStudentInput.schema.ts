import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutStudentInputObjectSchema } from './PaymentUpdateWithoutStudentInput.schema';
import { PaymentUncheckedUpdateWithoutStudentInputObjectSchema } from './PaymentUncheckedUpdateWithoutStudentInput.schema'

export const PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const PaymentUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
