import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutAcademicYearInput.schema';
import { CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyAcademicYearInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInput.schema';
import { CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInput.schema';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema'

export const CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithoutAcademicYearNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithoutAcademicYearNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
