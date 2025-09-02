import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { AcademicYearScalarRelationFilterObjectSchema } from './AcademicYearScalarRelationFilter.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { ScholarshipApplicationListRelationFilterObjectSchema } from './ScholarshipApplicationListRelationFilter.schema'

export const ScholarshipWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipWhereInput, z.ZodTypeDef, Prisma.ScholarshipWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipWhereInputObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipWhereInputObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  criteria: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  applicationDeadline: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  maxRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  currentRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  applications: z.lazy(() => ScholarshipApplicationListRelationFilterObjectSchema).optional()
}).strict();
export const ScholarshipWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipWhereInputObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipWhereInputObjectSchema), z.lazy(() => ScholarshipWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  criteria: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  applicationDeadline: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  maxRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  currentRecipients: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYear: z.union([z.lazy(() => AcademicYearScalarRelationFilterObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema)]).optional(),
  applications: z.lazy(() => ScholarshipApplicationListRelationFilterObjectSchema).optional()
}).strict();
