import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsUpdateManyMutationInputObjectSchema } from './objects/AnalyticsUpdateManyMutationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';

export const AnalyticsUpdateManyAndReturnSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(), data: AnalyticsUpdateManyMutationInputObjectSchema, where: AnalyticsWhereInputObjectSchema.optional()  }).strict()