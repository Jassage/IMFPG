import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateWithoutStudentInputObjectSchema } from './PaymentCreateWithoutStudentInput.schema';
import { PaymentUncheckedCreateWithoutStudentInputObjectSchema } from './PaymentUncheckedCreateWithoutStudentInput.schema';
import { PaymentCreateOrConnectWithoutStudentInputObjectSchema } from './PaymentCreateOrConnectWithoutStudentInput.schema';
import { PaymentCreateManyStudentInputEnvelopeObjectSchema } from './PaymentCreateManyStudentInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

export const PaymentUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
