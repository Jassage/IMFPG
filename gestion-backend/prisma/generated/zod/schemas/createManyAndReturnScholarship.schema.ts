import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipCreateManyInputObjectSchema } from './objects/ScholarshipCreateManyInput.schema';

export const ScholarshipCreateManyAndReturnSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), data: z.union([ ScholarshipCreateManyInputObjectSchema, z.array(ScholarshipCreateManyInputObjectSchema) ]),  }).strict()