import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationIncludeObjectSchema } from './objects/ScholarshipApplicationInclude.schema';
import { ScholarshipApplicationUpdateInputObjectSchema } from './objects/ScholarshipApplicationUpdateInput.schema';
import { ScholarshipApplicationUncheckedUpdateInputObjectSchema } from './objects/ScholarshipApplicationUncheckedUpdateInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';

export const ScholarshipApplicationUpdateOneSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), include: ScholarshipApplicationIncludeObjectSchema.optional(), data: z.union([ScholarshipApplicationUpdateInputObjectSchema, ScholarshipApplicationUncheckedUpdateInputObjectSchema]), where: ScholarshipApplicationWhereUniqueInputObjectSchema  })