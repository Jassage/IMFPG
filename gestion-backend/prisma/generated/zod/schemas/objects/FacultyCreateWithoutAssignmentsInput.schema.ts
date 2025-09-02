import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema } from './FacultyLevelCreateNestedManyWithoutFacultyInput.schema';
import { EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema } from './EnrollmentCreateNestedManyWithoutFacultyInput.schema'

export const FacultyCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyCreateWithoutAssignmentsInput> = z.object({
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
  levels: z.lazy(() => FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
export const FacultyCreateWithoutAssignmentsInputObjectZodSchema = z.object({
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
  levels: z.lazy(() => FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
