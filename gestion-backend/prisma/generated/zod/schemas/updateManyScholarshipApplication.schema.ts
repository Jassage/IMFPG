import { z } from 'zod';
import { ScholarshipApplicationUpdateManyMutationInputObjectSchema } from './objects/ScholarshipApplicationUpdateManyMutationInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';

export const ScholarshipApplicationUpdateManySchema = z.object({ data: ScholarshipApplicationUpdateManyMutationInputObjectSchema, where: ScholarshipApplicationWhereInputObjectSchema.optional()  })