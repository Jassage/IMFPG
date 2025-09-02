import { z } from 'zod';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';

export const GradeDeleteManySchema = z.object({ where: GradeWhereInputObjectSchema.optional()  })