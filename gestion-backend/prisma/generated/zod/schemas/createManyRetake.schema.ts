import { z } from 'zod';
import { RetakeCreateManyInputObjectSchema } from './objects/RetakeCreateManyInput.schema';

export const RetakeCreateManySchema = z.object({ data: z.union([ RetakeCreateManyInputObjectSchema, z.array(RetakeCreateManyInputObjectSchema) ]),  })