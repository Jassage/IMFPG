import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationIncludeObjectSchema } from './objects/ScholarshipApplicationInclude.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';

export const ScholarshipApplicationFindUniqueSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), include: ScholarshipApplicationIncludeObjectSchema.optional(), where: ScholarshipApplicationWhereUniqueInputObjectSchema })