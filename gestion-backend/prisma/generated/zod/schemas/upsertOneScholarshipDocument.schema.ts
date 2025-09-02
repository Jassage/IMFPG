import { z } from 'zod';
import { ScholarshipDocumentSelectObjectSchema } from './objects/ScholarshipDocumentSelect.schema';
import { ScholarshipDocumentIncludeObjectSchema } from './objects/ScholarshipDocumentInclude.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentCreateInputObjectSchema } from './objects/ScholarshipDocumentCreateInput.schema';
import { ScholarshipDocumentUncheckedCreateInputObjectSchema } from './objects/ScholarshipDocumentUncheckedCreateInput.schema';
import { ScholarshipDocumentUpdateInputObjectSchema } from './objects/ScholarshipDocumentUpdateInput.schema';
import { ScholarshipDocumentUncheckedUpdateInputObjectSchema } from './objects/ScholarshipDocumentUncheckedUpdateInput.schema';

export const ScholarshipDocumentUpsertSchema = z.object({ select: ScholarshipDocumentSelectObjectSchema.optional(), include: ScholarshipDocumentIncludeObjectSchema.optional(), where: ScholarshipDocumentWhereUniqueInputObjectSchema, create: z.union([ ScholarshipDocumentCreateInputObjectSchema, ScholarshipDocumentUncheckedCreateInputObjectSchema ]), update: z.union([ ScholarshipDocumentUpdateInputObjectSchema, ScholarshipDocumentUncheckedUpdateInputObjectSchema ])  })