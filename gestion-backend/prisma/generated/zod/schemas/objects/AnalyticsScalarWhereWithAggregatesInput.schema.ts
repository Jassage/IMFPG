import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const AnalyticsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AnalyticsScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.AnalyticsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  generatedDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  parameters: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional()
}).strict();
export const AnalyticsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnalyticsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  generatedDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  parameters: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional()
}).strict();
