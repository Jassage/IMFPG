import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeIncludeObjectSchema } from './objects/GradeInclude.schema';
import { GradeUpdateInputObjectSchema } from './objects/GradeUpdateInput.schema';
import { GradeUncheckedUpdateInputObjectSchema } from './objects/GradeUncheckedUpdateInput.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';

export const GradeUpdateOneSchema = z.object({ select: GradeSelectObjectSchema.optional(), include: GradeIncludeObjectSchema.optional(), data: z.union([GradeUpdateInputObjectSchema, GradeUncheckedUpdateInputObjectSchema]), where: GradeWhereUniqueInputObjectSchema  })