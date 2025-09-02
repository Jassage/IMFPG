import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutStudentInputObjectSchema } from './GradeCreateWithoutStudentInput.schema';
import { GradeUncheckedCreateWithoutStudentInputObjectSchema } from './GradeUncheckedCreateWithoutStudentInput.schema';
import { GradeCreateOrConnectWithoutStudentInputObjectSchema } from './GradeCreateOrConnectWithoutStudentInput.schema';
import { GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './GradeUpsertWithWhereUniqueWithoutStudentInput.schema';
import { GradeCreateManyStudentInputEnvelopeObjectSchema } from './GradeCreateManyStudentInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './GradeUpdateWithWhereUniqueWithoutStudentInput.schema';
import { GradeUpdateManyWithWhereWithoutStudentInputObjectSchema } from './GradeUpdateManyWithWhereWithoutStudentInput.schema';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema'

export const GradeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.GradeUncheckedUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.GradeUncheckedUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GradeUncheckedUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
