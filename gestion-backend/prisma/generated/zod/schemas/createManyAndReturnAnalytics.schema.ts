import { z } from 'zod';
import { AnalyticsSelectObjectSchema } from './objects/AnalyticsSelect.schema';
import { AnalyticsCreateManyInputObjectSchema } from './objects/AnalyticsCreateManyInput.schema';

export const AnalyticsCreateManyAndReturnSchema = z.object({ select: AnalyticsSelectObjectSchema.optional(), data: z.union([ AnalyticsCreateManyInputObjectSchema, z.array(AnalyticsCreateManyInputObjectSchema) ]),  }).strict()