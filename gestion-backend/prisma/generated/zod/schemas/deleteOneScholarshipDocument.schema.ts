import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentIncludeObjectSchema } from './objects/ScholarshipDocumentInclude.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';

export const ScholarshipDocumentDeleteOneSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), include: ScholarshipDocumentIncludeObjectSchema.optional(), where: ScholarshipDocumentWhereUniqueInputObjectSchema  })