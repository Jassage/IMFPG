import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentIncludeObjectSchema } from './objects/StudentInclude.schema';
import { StudentUpdateInputObjectSchema } from './objects/StudentUpdateInput.schema';
import { StudentUncheckedUpdateInputObjectSchema } from './objects/StudentUncheckedUpdateInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';

export const StudentUpdateOneSchema = z.object({ select: StudentSelectObjectSchema.optional(), include: StudentIncludeObjectSchema.optional(), data: z.union([StudentUpdateInputObjectSchema, StudentUncheckedUpdateInputObjectSchema]), where: StudentWhereUniqueInputObjectSchema  })