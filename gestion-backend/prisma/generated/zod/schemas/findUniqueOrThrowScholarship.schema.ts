import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipIncludeObjectSchema } from './objects/ScholarshipInclude.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';

export const ScholarshipFindUniqueOrThrowSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), include: ScholarshipIncludeObjectSchema.optional(), where: ScholarshipWhereUniqueInputObjectSchema })