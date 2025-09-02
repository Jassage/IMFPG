import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './objects/GradeUpdateManyMutationInput.schema';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';

export const GradeUpdateManyAndReturnSchema = z.object({ select: GradeSelectObjectSchema.optional(), data: GradeUpdateManyMutationInputObjectSchema, where: GradeWhereInputObjectSchema.optional()  }).strict()