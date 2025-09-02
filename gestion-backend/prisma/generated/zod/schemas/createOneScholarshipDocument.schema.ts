import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentIncludeObjectSchema } from './objects/ScholarshipDocumentInclude.schema';
import { ScholarshipDocumentCreateInputObjectSchema } from './objects/ScholarshipDocumentCreateInput.schema';
import { ScholarshipDocumentUncheckedCreateInputObjectSchema } from './objects/ScholarshipDocumentUncheckedCreateInput.schema';

export const ScholarshipDocumentCreateOneSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), include: ScholarshipDocumentIncludeObjectSchema.optional(), data: z.union([ScholarshipDocumentCreateInputObjectSchema, ScholarshipDocumentUncheckedCreateInputObjectSchema])  })