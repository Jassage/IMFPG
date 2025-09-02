import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutStudentInputObjectSchema } from './PaymentUpdateWithoutStudentInput.schema';
import { PaymentUncheckedUpdateWithoutStudentInputObjectSchema } from './PaymentUncheckedUpdateWithoutStudentInput.schema';
import { PaymentCreateWithoutStudentInputObjectSchema } from './PaymentCreateWithoutStudentInput.schema';
import { PaymentUncheckedCreateWithoutStudentInputObjectSchema } from './PaymentUncheckedCreateWithoutStudentInput.schema'

export const PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const PaymentUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
