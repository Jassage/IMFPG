import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentUpdateManyMutationInputObjectSchema } from './objects/StudentUpdateManyMutationInput.schema';
import { StudentWhereInputObjectSchema } from './objects/StudentWhereInput.schema';

export const StudentUpdateManyAndReturnSchema = z.object({ select: StudentSelectObjectSchema.optional(), data: StudentUpdateManyMutationInputObjectSchema, where: StudentWhereInputObjectSchema.optional()  }).strict()