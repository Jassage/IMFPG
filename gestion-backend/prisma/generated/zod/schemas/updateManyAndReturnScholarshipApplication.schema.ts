import { z } from 'zod';
import { ScholarshipApplicationSelectObjectSchema } from './objects/ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationUpdateManyMutationInputObjectSchema } from './objects/ScholarshipApplicationUpdateManyMutationInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';

export const ScholarshipApplicationUpdateManyAndReturnSchema = z.object({ select: ScholarshipApplicationSelectObjectSchema.optional(), data: ScholarshipApplicationUpdateManyMutationInputObjectSchema, where: ScholarshipApplicationWhereInputObjectSchema.optional()  }).strict()