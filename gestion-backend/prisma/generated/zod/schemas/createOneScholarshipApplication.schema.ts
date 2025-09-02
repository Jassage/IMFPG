import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationIncludeObjectSchema } from './objects/ScholarshipApplicationInclude.schema';
import { ScholarshipApplicationCreateInputObjectSchema } from './objects/ScholarshipApplicationCreateInput.schema';
import { ScholarshipApplicationUncheckedCreateInputObjectSchema } from './objects/ScholarshipApplicationUncheckedCreateInput.schema';

export const ScholarshipApplicationCreateOneSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), include: ScholarshipApplicationIncludeObjectSchema.optional(), data: z.union([ScholarshipApplicationCreateInputObjectSchema, ScholarshipApplicationUncheckedCreateInputObjectSchema])  })