import { z } from 'zod';
import { ScholarshipDocumentUpdateManyMutationInputObjectSchema } from './objects/ScholarshipDocumentUpdateManyMutationInput.schema';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';

export const ScholarshipDocumentUpdateManySchema = z.object({ data: ScholarshipDocumentUpdateManyMutationInputObjectSchema, where: ScholarshipDocumentWhereInputObjectSchema.optional()  })