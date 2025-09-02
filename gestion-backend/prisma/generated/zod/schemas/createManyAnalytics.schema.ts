import { z } from 'zod';
import { AnalyticsCreateManyInputObjectSchema } from './objects/AnalyticsCreateManyInput.schema';

export const AnalyticsCreateManySchema = z.object({ data: z.union([ AnalyticsCreateManyInputObjectSchema, z.array(AnalyticsCreateManyInputObjectSchema) ]),  })