import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationIncludeObjectSchema } from './objects/ScholarshipApplicationInclude.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCreateInputObjectSchema } from './objects/ScholarshipApplicationCreateInput.schema';
import { ScholarshipApplicationUncheckedCreateInputObjectSchema } from './objects/ScholarshipApplicationUncheckedCreateInput.schema';
import { ScholarshipApplicationUpdateInputObjectSchema } from './objects/ScholarshipApplicationUpdateInput.schema';
import { ScholarshipApplicationUncheckedUpdateInputObjectSchema } from './objects/ScholarshipApplicationUncheckedUpdateInput.schema';

export const ScholarshipApplicationUpsertSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), include: ScholarshipApplicationIncludeObjectSchema.optional(), where: ScholarshipApplicationWhereUniqueInputObjectSchema, create: z.union([ ScholarshipApplicationCreateInputObjectSchema, ScholarshipApplicationUncheckedCreateInputObjectSchema ]), update: z.union([ ScholarshipApplicationUpdateInputObjectSchema, ScholarshipApplicationUncheckedUpdateInputObjectSchema ])  })