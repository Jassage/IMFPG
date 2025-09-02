import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipIncludeObjectSchema } from './objects/ScholarshipInclude.schema';
import { ScholarshipCreateInputObjectSchema } from './objects/ScholarshipCreateInput.schema';
import { ScholarshipUncheckedCreateInputObjectSchema } from './objects/ScholarshipUncheckedCreateInput.schema';

export const ScholarshipCreateOneSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), include: ScholarshipIncludeObjectSchema.optional(), data: z.union([ScholarshipCreateInputObjectSchema, ScholarshipUncheckedCreateInputObjectSchema])  })