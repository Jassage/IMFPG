import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentCreateManyAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyAcademicYearInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const CourseAssignmentCreateManyAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
