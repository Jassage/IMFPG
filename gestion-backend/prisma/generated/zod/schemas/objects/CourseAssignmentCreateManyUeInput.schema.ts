import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentCreateManyUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyUeInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyUeInput> = z.object({
  id: z.string().optional(),
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
export const CourseAssignmentCreateManyUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
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
