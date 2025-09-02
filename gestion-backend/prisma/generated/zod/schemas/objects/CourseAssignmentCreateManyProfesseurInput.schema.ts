import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentCreateManyProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyProfesseurInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const CourseAssignmentCreateManyProfesseurInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
