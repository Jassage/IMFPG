import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema } from './CourseAssignmentCreateManyAcademicYearInputEnvelope.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema), z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
