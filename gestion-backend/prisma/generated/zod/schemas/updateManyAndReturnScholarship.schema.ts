import { z } from 'zod';
import { ScholarshipSelectObjectSchema } from './objects/ScholarshipSelect.schema';
import { ScholarshipUpdateManyMutationInputObjectSchema } from './objects/ScholarshipUpdateManyMutationInput.schema';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';

export const ScholarshipUpdateManyAndReturnSchema = z.object({ select: ScholarshipSelectObjectSchema.optional(), data: ScholarshipUpdateManyMutationInputObjectSchema, where: ScholarshipWhereInputObjectSchema.optional()  }).strict()