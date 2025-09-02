import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentCreateManyFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyFacultyInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const CourseAssignmentCreateManyFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
