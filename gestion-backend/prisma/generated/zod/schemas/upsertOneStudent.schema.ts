import { z } from 'zod';
import { StudentSelectObjectSchema } from './objects/StudentSelect.schema';
import { StudentIncludeObjectSchema } from './objects/StudentInclude.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';
import { StudentCreateInputObjectSchema } from './objects/StudentCreateInput.schema';
import { StudentUncheckedCreateInputObjectSchema } from './objects/StudentUncheckedCreateInput.schema';
import { StudentUpdateInputObjectSchema } from './objects/StudentUpdateInput.schema';
import { StudentUncheckedUpdateInputObjectSchema } from './objects/StudentUncheckedUpdateInput.schema';

export const StudentUpsertSchema = z.object({ select: StudentSelectObjectSchema.optional(), include: StudentIncludeObjectSchema.optional(), where: StudentWhereUniqueInputObjectSchema, create: z.union([ StudentCreateInputObjectSchema, StudentUncheckedCreateInputObjectSchema ]), update: z.union([ StudentUpdateInputObjectSchema, StudentUncheckedUpdateInputObjectSchema ])  })