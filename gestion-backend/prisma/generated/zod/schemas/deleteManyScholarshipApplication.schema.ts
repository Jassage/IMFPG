import { z } from 'zod';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';

export const ScholarshipApplicationDeleteManySchema = z.object({ where: ScholarshipApplicationWhereInputObjectSchema.optional()  })