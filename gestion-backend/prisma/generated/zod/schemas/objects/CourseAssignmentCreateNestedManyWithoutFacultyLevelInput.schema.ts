import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutFacultyLevelInput.schema';
import { CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyFacultyLevelInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateNestedManyWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateNestedManyWithoutFacultyLevelInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
