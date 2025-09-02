import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { ScholarshipScalarRelationFilterObjectSchema } from './ScholarshipScalarRelationFilter.schema';
import { ScholarshipWhereInputObjectSchema } from './ScholarshipWhereInput.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { ScholarshipDocumentListRelationFilterObjectSchema } from './ScholarshipDocumentListRelationFilter.schema'

export const ScholarshipApplicationWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationWhereInput, z.ZodTypeDef, Prisma.ScholarshipApplicationWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  scholarship: z.union([z.lazy(() => ScholarshipScalarRelationFilterObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema)]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  documents: z.lazy(() => ScholarshipDocumentListRelationFilterObjectSchema).optional()
}).strict();
export const ScholarshipApplicationWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipApplicationWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipApplicationWhereInputObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).array()]).optional(),
  scholarshipId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  applicationDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  motivation: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewNotes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  scholarship: z.union([z.lazy(() => ScholarshipScalarRelationFilterObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema)]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  documents: z.lazy(() => ScholarshipDocumentListRelationFilterObjectSchema).optional()
}).strict();
