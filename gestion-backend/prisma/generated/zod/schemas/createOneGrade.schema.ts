import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeIncludeObjectSchema } from './objects/GradeInclude.schema';
import { GradeCreateInputObjectSchema } from './objects/GradeCreateInput.schema';
import { GradeUncheckedCreateInputObjectSchema } from './objects/GradeUncheckedCreateInput.schema';

export const GradeCreateOneSchema = z.object({ select: GradeSelectObjectSchema.optional(), include: GradeIncludeObjectSchema.optional(), data: z.union([GradeCreateInputObjectSchema, GradeUncheckedCreateInputObjectSchema])  })