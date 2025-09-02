import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutStudentInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutStudentInput.schema';
import { ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInput.schema';
import { ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema } from './ScholarshipApplicationCreateManyStudentInputEnvelope.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInput.schema';
import { ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema } from './ScholarshipApplicationUpdateManyWithWhereWithoutStudentInput.schema';
import { ScholarshipApplicationScalarWhereInputObjectSchema } from './ScholarshipApplicationScalarWhereInput.schema'

export const ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
