import { z } from 'zod';
import { ScholarshipDocumentCreateManyInputObjectSchema } from './objects/ScholarshipDocumentCreateManyInput.schema';

export const ScholarshipDocumentCreateManySchema = z.object({ data: z.union([ ScholarshipDocumentCreateManyInputObjectSchema, z.array(ScholarshipDocumentCreateManyInputObjectSchema) ]),  })