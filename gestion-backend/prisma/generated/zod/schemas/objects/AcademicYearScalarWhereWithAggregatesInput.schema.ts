import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema'

export const AcademicYearScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AcademicYearScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.AcademicYearScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  year: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  startDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  isCurrent: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const AcademicYearScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcademicYearScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  year: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  startDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  isCurrent: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
