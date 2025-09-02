import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipIncludeObjectSchema } from './objects/ScholarshipInclude.schema';
import { ScholarshipUpdateInputObjectSchema } from './objects/ScholarshipUpdateInput.schema';
import { ScholarshipUncheckedUpdateInputObjectSchema } from './objects/ScholarshipUncheckedUpdateInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';

export const ScholarshipUpdateOneSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), include: ScholarshipIncludeObjectSchema.optional(), data: z.union([ScholarshipUpdateInputObjectSchema, ScholarshipUncheckedUpdateInputObjectSchema]), where: ScholarshipWhereUniqueInputObjectSchema  })