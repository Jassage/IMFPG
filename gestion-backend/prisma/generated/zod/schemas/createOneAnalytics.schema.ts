import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsCreateInputObjectSchema } from './objects/AnalyticsCreateInput.schema';
import { AnalyticsUncheckedCreateInputObjectSchema } from './objects/AnalyticsUncheckedCreateInput.schema';

export const AnalyticsCreateOneSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(),  data: z.union([AnalyticsCreateInputObjectSchema, AnalyticsUncheckedCreateInputObjectSchema])  })