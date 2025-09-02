import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutAcademicYearInputObjectSchema } from './GradeCreateWithoutAcademicYearInput.schema';
import { GradeUncheckedCreateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateWithoutAcademicYearInput.schema';
import { GradeCreateOrConnectWithoutAcademicYearInputObjectSchema } from './GradeCreateOrConnectWithoutAcademicYearInput.schema';
import { GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './GradeUpsertWithWhereUniqueWithoutAcademicYearInput.schema';
import { GradeCreateManyAcademicYearInputEnvelopeObjectSchema } from './GradeCreateManyAcademicYearInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './GradeUpdateWithWhereUniqueWithoutAcademicYearInput.schema';
import { GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema } from './GradeUpdateManyWithWhereWithoutAcademicYearInput.schema';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema'

export const GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithoutAcademicYearNestedInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithoutAcademicYearNestedInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GradeUpdateManyWithoutAcademicYearNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
