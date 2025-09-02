import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateWithoutStudentInputObjectSchema } from './PaymentCreateWithoutStudentInput.schema';
import { PaymentUncheckedCreateWithoutStudentInputObjectSchema } from './PaymentUncheckedCreateWithoutStudentInput.schema';
import { PaymentCreateOrConnectWithoutStudentInputObjectSchema } from './PaymentCreateOrConnectWithoutStudentInput.schema';
import { PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './PaymentUpsertWithWhereUniqueWithoutStudentInput.schema';
import { PaymentCreateManyStudentInputEnvelopeObjectSchema } from './PaymentCreateManyStudentInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './PaymentUpdateWithWhereUniqueWithoutStudentInput.schema';
import { PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema } from './PaymentUpdateManyWithWhereWithoutStudentInput.schema';
import { PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema'

export const PaymentUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.PaymentUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.PaymentUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
