import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyInput.schema';
import { CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutFacultyInput.schema';
import { CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema } from './CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInput.schema';
import { CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyFacultyInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema } from './CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInput.schema';
import { CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema } from './CourseAssignmentUpdateManyWithWhereWithoutFacultyInput.schema';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema'

export const CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
