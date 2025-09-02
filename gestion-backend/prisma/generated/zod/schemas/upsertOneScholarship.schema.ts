import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipIncludeObjectSchema } from './objects/ScholarshipInclude.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';
import { ScholarshipCreateInputObjectSchema } from './objects/ScholarshipCreateInput.schema';
import { ScholarshipUncheckedCreateInputObjectSchema } from './objects/ScholarshipUncheckedCreateInput.schema';
import { ScholarshipUpdateInputObjectSchema } from './objects/ScholarshipUpdateInput.schema';
import { ScholarshipUncheckedUpdateInputObjectSchema } from './objects/ScholarshipUncheckedUpdateInput.schema';

export const ScholarshipUpsertSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), include: ScholarshipIncludeObjectSchema.optional(), where: ScholarshipWhereUniqueInputObjectSchema, create: z.union([ ScholarshipCreateInputObjectSchema, ScholarshipUncheckedCreateInputObjectSchema ]), update: z.union([ ScholarshipUpdateInputObjectSchema, ScholarshipUncheckedUpdateInputObjectSchema ])  })