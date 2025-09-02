import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsUpdateInputObjectSchema } from './objects/AnalyticsUpdateInput.schema';
import { AnalyticsUncheckedUpdateInputObjectSchema } from './objects/AnalyticsUncheckedUpdateInput.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';

export const AnalyticsUpdateOneSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(),  data: z.union([AnalyticsUpdateInputObjectSchema, AnalyticsUncheckedUpdateInputObjectSchema]), where: AnalyticsWhereUniqueInputObjectSchema  })