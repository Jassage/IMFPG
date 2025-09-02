import { z } from 'zod';
import { ScholarshipUpdateManyMutationInputObjectSchema } from './objects/ScholarshipUpdateManyMutationInput.schema';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';

export const ScholarshipUpdateManySchema = z.object({ data: ScholarshipUpdateManyMutationInputObjectSchema, where: ScholarshipWhereInputObjectSchema.optional()  })