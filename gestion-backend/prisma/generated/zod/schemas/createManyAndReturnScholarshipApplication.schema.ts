import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationCreateManyInputObjectSchema } from './objects/ScholarshipApplicationCreateManyInput.schema';

export const ScholarshipApplicationCreateManyAndReturnSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), data: z.union([ ScholarshipApplicationCreateManyInputObjectSchema, z.array(ScholarshipApplicationCreateManyInputObjectSchema) ]),  }).strict()