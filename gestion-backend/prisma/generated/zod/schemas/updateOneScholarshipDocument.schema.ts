import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentIncludeObjectSchema } from './objects/ScholarshipDocumentInclude.schema';
import { ScholarshipDocumentUpdateInputObjectSchema } from './objects/ScholarshipDocumentUpdateInput.schema';
import { ScholarshipDocumentUncheckedUpdateInputObjectSchema } from './objects/ScholarshipDocumentUncheckedUpdateInput.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';

export const ScholarshipDocumentUpdateOneSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), include: ScholarshipDocumentIncludeObjectSchema.optional(), data: z.union([ScholarshipDocumentUpdateInputObjectSchema, ScholarshipDocumentUncheckedUpdateInputObjectSchema]), where: ScholarshipDocumentWhereUniqueInputObjectSchema  })