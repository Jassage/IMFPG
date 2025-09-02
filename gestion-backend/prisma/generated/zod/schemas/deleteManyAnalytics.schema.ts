import { z } from 'zod';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';

export const AnalyticsDeleteManySchema = z.object({ where: AnalyticsWhereInputObjectSchema.optional()  })