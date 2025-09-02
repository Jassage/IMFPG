import { z } from 'zod';
import { GradeUpdateManyMutationInputObjectSchema } from './objects/GradeUpdateManyMutationInput.schema';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';

export const GradeUpdateManySchema = z.object({ data: GradeUpdateManyMutationInputObjectSchema, where: GradeWhereInputObjectSchema.optional()  })