import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const AnalyticsWhereInputObjectSchema: z.ZodType<Prisma.AnalyticsWhereInput, z.ZodTypeDef, Prisma.AnalyticsWhereInput> = z.object({
  AND: z.union([z.lazy(() => AnalyticsWhereInputObjectSchema), z.lazy(() => AnalyticsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnalyticsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnalyticsWhereInputObjectSchema), z.lazy(() => AnalyticsWhereInputObjectSchema).array()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data: z.lazy(() => JsonFilterObjectSchema).optional(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  parameters: z.lazy(() => JsonFilterObjectSchema).optional()
}).strict();
export const AnalyticsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnalyticsWhereInputObjectSchema), z.lazy(() => AnalyticsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnalyticsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnalyticsWhereInputObjectSchema), z.lazy(() => AnalyticsWhereInputObjectSchema).array()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data: z.lazy(() => JsonFilterObjectSchema).optional(),
  generatedDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  parameters: z.lazy(() => JsonFilterObjectSchema).optional()
}).strict();
