import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeCreateManyInputObjectSchema } from './objects/GradeCreateManyInput.schema';

export const GradeCreateManyAndReturnSchema = z.object({ select: GradeSelectObjectSchema.optional(), data: z.union([ GradeCreateManyInputObjectSchema, z.array(GradeCreateManyInputObjectSchema) ]),  }).strict()