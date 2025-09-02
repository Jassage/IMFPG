import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateWithoutAcademicYearInput.schema';
import { ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateOrConnectWithoutAcademicYearInput.schema';
import { ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInput.schema';
import { ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema } from './ScholarshipCreateManyAcademicYearInputEnvelope.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInput.schema';
import { ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema } from './ScholarshipUpdateManyWithWhereWithoutAcademicYearInput.schema';
import { ScholarshipScalarWhereInputObjectSchema } from './ScholarshipScalarWhereInput.schema'

export const ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInput, z.ZodTypeDef, Prisma.ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScholarshipScalarWhereInputObjectSchema), z.lazy(() => ScholarshipScalarWhereInputObjectSchema).array()]).optional()
}).strict();
