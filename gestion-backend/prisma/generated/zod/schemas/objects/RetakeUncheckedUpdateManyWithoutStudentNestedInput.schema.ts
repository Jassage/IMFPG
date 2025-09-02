import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateWithoutStudentInputObjectSchema } from './RetakeCreateWithoutStudentInput.schema';
import { RetakeUncheckedCreateWithoutStudentInputObjectSchema } from './RetakeUncheckedCreateWithoutStudentInput.schema';
import { RetakeCreateOrConnectWithoutStudentInputObjectSchema } from './RetakeCreateOrConnectWithoutStudentInput.schema';
import { RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './RetakeUpsertWithWhereUniqueWithoutStudentInput.schema';
import { RetakeCreateManyStudentInputEnvelopeObjectSchema } from './RetakeCreateManyStudentInputEnvelope.schema';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './RetakeUpdateWithWhereUniqueWithoutStudentInput.schema';
import { RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema } from './RetakeUpdateManyWithWhereWithoutStudentInput.schema';
import { RetakeScalarWhereInputObjectSchema } from './RetakeScalarWhereInput.schema'

export const RetakeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.RetakeUncheckedUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RetakeUncheckedUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
