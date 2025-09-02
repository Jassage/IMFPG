import { z } from 'zod';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';

export const ScholarshipDeleteManySchema = z.object({ where: ScholarshipWhereInputObjectSchema.optional()  })