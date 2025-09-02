import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeCreateManyInputObjectSchema } from './objects/RetakeCreateManyInput.schema';

export const RetakeCreateManyAndReturnSchema = z.object({ select: RetakeSelectObjectSchema.optional(), data: z.union([ RetakeCreateManyInputObjectSchema, z.array(RetakeCreateManyInputObjectSchema) ]),  }).strict()