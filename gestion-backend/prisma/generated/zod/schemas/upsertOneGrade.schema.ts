import { z } from 'zod';
import { GradeSelectObjectSchema } from './objects/GradeSelect.schema';
import { GradeIncludeObjectSchema } from './objects/GradeInclude.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';
import { GradeCreateInputObjectSchema } from './objects/GradeCreateInput.schema';
import { GradeUncheckedCreateInputObjectSchema } from './objects/GradeUncheckedCreateInput.schema';
import { GradeUpdateInputObjectSchema } from './objects/GradeUpdateInput.schema';
import { GradeUncheckedUpdateInputObjectSchema } from './objects/GradeUncheckedUpdateInput.schema';

export const GradeUpsertSchema = z.object({ select: GradeSelectObjectSchema.optional(), include: GradeIncludeObjectSchema.optional(), where: GradeWhereUniqueInputObjectSchema, create: z.union([ GradeCreateInputObjectSchema, GradeUncheckedCreateInputObjectSchema ]), update: z.union([ GradeUpdateInputObjectSchema, GradeUncheckedUpdateInputObjectSchema ])  })