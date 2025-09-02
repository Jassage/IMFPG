import { z } from 'zod';
import { ScholarshipApplicationCreateManyInputObjectSchema } from './objects/ScholarshipApplicationCreateManyInput.schema';

export const ScholarshipApplicationCreateManySchema = z.object({ data: z.union([ ScholarshipApplicationCreateManyInputObjectSchema, z.array(ScholarshipApplicationCreateManyInputObjectSchema) ]),  })