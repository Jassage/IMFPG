import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentCreateManyInputObjectSchema } from './objects/StudentCreateManyInput.schema';

export const StudentCreateManyAndReturnSchema = z.object({ select: StudentSelectObjectSchema.optional(), data: z.union([ StudentCreateManyInputObjectSchema, z.array(StudentCreateManyInputObjectSchema) ]),  }).strict()