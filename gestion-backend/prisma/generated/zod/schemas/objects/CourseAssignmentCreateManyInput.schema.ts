import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentCreateManyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const CourseAssignmentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
