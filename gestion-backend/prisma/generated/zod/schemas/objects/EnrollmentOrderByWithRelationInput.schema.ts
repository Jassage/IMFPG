import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { FacultyOrderByWithRelationInputObjectSchema } from './FacultyOrderByWithRelationInput.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './AcademicYearOrderByWithRelationInput.schema';
import { EnrollmentOrderByRelevanceInputObjectSchema } from './EnrollmentOrderByRelevanceInput.schema'

export const EnrollmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.EnrollmentOrderByWithRelationInput, z.ZodTypeDef, Prisma.EnrollmentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => EnrollmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const EnrollmentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => EnrollmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
