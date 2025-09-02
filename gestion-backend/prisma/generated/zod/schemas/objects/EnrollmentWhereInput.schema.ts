import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumEnrollmentStatusFilterObjectSchema } from './EnumEnrollmentStatusFilter.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { FacultyScalarRelationFilterObjectSchema } from './FacultyScalarRelationFilter.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { AcademicYearScalarRelationFilterObjectSchema } from './AcademicYearScalarRelationFilter.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const EnrollmentWhereInputObjectSchema: z.ZodType<Prisma.EnrollmentWhereInput, z.ZodTypeDef, Prisma.EnrollmentWhereInput> = z.object({
  AND: z.union([z.lazy(() => EnrollmentWhereInputObjectSchema), z.lazy(() => EnrollmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentWhereInputObjectSchema), z.lazy(() => EnrollmentWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusFilterObjectSchema), EnrollmentStatusSchema]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional()
}).strict();
export const EnrollmentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EnrollmentWhereInputObjectSchema), z.lazy(() => EnrollmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentWhereInputObjectSchema), z.lazy(() => EnrollmentWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusFilterObjectSchema), EnrollmentStatusSchema]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  faculty: z.union([z.lazy(() => FacultyScalarRelationFilterObjectSchema), z.lazy(() => FacultyWhereInputObjectSchema)]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional()
}).strict();
