import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutFacultyLevelInput.schema';
import { CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInput.schema';
import { CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyFacultyLevelInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInput.schema';
import { CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInput.schema';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema'

export const CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema), z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
