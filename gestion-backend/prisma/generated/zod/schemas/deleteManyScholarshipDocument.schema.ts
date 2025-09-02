import { z } from 'zod';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';

export const ScholarshipDocumentDeleteManySchema = z.object({ where: ScholarshipDocumentWhereInputObjectSchema.optional()  })