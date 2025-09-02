import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelUncheckedCreateNestedManyWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedCreateNestedManyWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutFacultyInput.schema'

export const FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyUncheckedCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyUncheckedCreateWithoutAssignmentsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  levels: z.lazy(() => FacultyLevelUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
export const FacultyUncheckedCreateWithoutAssignmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  levels: z.lazy(() => FacultyLevelUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
