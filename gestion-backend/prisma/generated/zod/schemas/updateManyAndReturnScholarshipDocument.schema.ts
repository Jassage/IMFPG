import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentUpdateManyMutationInputObjectSchema } from './objects/ScholarshipDocumentUpdateManyMutationInput.schema';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';

export const ScholarshipDocumentUpdateManyAndReturnSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), data: ScholarshipDocumentUpdateManyMutationInputObjectSchema, where: ScholarshipDocumentWhereInputObjectSchema.optional()  }).strict()