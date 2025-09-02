import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelIncludeObjectSchema } from './objects/FacultyLevelInclude.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelCreateInputObjectSchema } from './objects/FacultyLevelCreateInput.schema';
import { FacultyLevelUncheckedCreateInputObjectSchema } from './objects/FacultyLevelUncheckedCreateInput.schema';
import { FacultyLevelUpdateInputObjectSchema } from './objects/FacultyLevelUpdateInput.schema';
import { FacultyLevelUncheckedUpdateInputObjectSchema } from './objects/FacultyLevelUncheckedUpdateInput.schema';

export const FacultyLevelUpsertSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), include: FacultyLevelIncludeObjectSchema.optional(), where: FacultyLevelWhereUniqueInputObjectSchema, create: z.union([ FacultyLevelCreateInputObjectSchema, FacultyLevelUncheckedCreateInputObjectSchema ]), update: z.union([ FacultyLevelUpdateInputObjectSchema, FacultyLevelUncheckedUpdateInputObjectSchema ])  })