import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';
import { AnalyticsCreateInputObjectSchema } from './objects/AnalyticsCreateInput.schema';
import { AnalyticsUncheckedCreateInputObjectSchema } from './objects/AnalyticsUncheckedCreateInput.schema';
import { AnalyticsUpdateInputObjectSchema } from './objects/AnalyticsUpdateInput.schema';
import { AnalyticsUncheckedUpdateInputObjectSchema } from './objects/AnalyticsUncheckedUpdateInput.schema';

export const AnalyticsUpsertSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(),  where: AnalyticsWhereUniqueInputObjectSchema, create: z.union([ AnalyticsCreateInputObjectSchema, AnalyticsUncheckedCreateInputObjectSchema ]), update: z.union([ AnalyticsUpdateInputObjectSchema, AnalyticsUncheckedUpdateInputObjectSchema ])  })