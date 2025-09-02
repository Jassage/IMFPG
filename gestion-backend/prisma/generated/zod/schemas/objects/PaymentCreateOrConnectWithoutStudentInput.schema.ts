import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutStudentInputObjectSchema } from './PaymentCreateWithoutStudentInput.schema';
import { PaymentUncheckedCreateWithoutStudentInputObjectSchema } from './PaymentUncheckedCreateWithoutStudentInput.schema'

export const PaymentCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
