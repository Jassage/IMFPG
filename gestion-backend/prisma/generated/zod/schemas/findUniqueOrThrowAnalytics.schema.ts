import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';

export const AnalyticsFindUniqueOrThrowSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(),  where: AnalyticsWhereUniqueInputObjectSchema })