import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateWithoutAcademicYearInputObjectSchema } from './PaymentCreateWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateWithoutAcademicYearInput.schema';
import { PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './PaymentCreateOrConnectWithoutAcademicYearInput.schema';
import { PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './PaymentUpsertWithWhereUniqueWithoutAcademicYearInput.schema';
import { PaymentCreateManyAcademicYearInputEnvelopeObjectSchema } from './PaymentCreateManyAcademicYearInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './PaymentUpdateWithWhereUniqueWithoutAcademicYearInput.schema';
import { PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema } from './PaymentUpdateManyWithWhereWithoutAcademicYearInput.schema';
import { PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema'

export const PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutAcademicYearNestedInput, z.ZodTypeDef, Prisma.PaymentUncheckedUpdateManyWithoutAcademicYearNestedInput> = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
