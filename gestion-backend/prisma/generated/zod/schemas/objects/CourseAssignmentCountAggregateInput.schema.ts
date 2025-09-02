import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CourseAssignmentCountAggregateInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCountAggregateInputType, z.ZodTypeDef, Prisma.CourseAssignmentCountAggregateInputType> = z.object({
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
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CourseAssignmentCountAggregateInputObjectZodSchema = z.object({
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
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
