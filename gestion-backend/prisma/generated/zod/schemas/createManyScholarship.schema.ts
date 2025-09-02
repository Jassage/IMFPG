import { z } from 'zod';
import { ScholarshipCreateManyInputObjectSchema } from './objects/ScholarshipCreateManyInput.schema';

export const ScholarshipCreateManySchema = z.object({ data: z.union([ ScholarshipCreateManyInputObjectSchema, z.array(ScholarshipCreateManyInputObjectSchema) ]),  })