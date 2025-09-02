import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyInput.schema';
import { CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutFacultyInput.schema';
import { CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyFacultyInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateNestedManyWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateNestedManyWithoutFacultyInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentCreateNestedManyWithoutFacultyInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
