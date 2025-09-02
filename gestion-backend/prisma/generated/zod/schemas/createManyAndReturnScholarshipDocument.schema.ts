import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentCreateManyInputObjectSchema } from './objects/ScholarshipDocumentCreateManyInput.schema';

export const ScholarshipDocumentCreateManyAndReturnSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), data: z.union([ ScholarshipDocumentCreateManyInputObjectSchema, z.array(ScholarshipDocumentCreateManyInputObjectSchema) ]),  }).strict()