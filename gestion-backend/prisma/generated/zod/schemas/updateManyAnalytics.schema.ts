import { z } from 'zod';
import { AnalyticsUpdateManyMutationInputObjectSchema } from './objects/AnalyticsUpdateManyMutationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';

export const AnalyticsUpdateManySchema = z.object({ data: AnalyticsUpdateManyMutationInputObjectSchema, where: AnalyticsWhereInputObjectSchema.optional()  })