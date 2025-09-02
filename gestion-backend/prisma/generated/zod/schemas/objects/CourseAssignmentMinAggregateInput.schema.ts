import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CourseAssignmentMinAggregateInputObjectSchema: z.ZodType<Prisma.CourseAssignmentMinAggregateInputType, z.ZodTypeDef, Prisma.CourseAssignmentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  level: z.literal(true).optional(),
  facultyLevelId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CourseAssignmentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  level: z.literal(true).optional(),
  facultyLevelId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
