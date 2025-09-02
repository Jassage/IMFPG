import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelIncludeObjectSchema } from './objects/FacultyLevelInclude.schema';
import { FacultyLevelUpdateInputObjectSchema } from './objects/FacultyLevelUpdateInput.schema';
import { FacultyLevelUncheckedUpdateInputObjectSchema } from './objects/FacultyLevelUncheckedUpdateInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';

export const FacultyLevelUpdateOneSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), include: FacultyLevelIncludeObjectSchema.optional(), data: z.union([FacultyLevelUpdateInputObjectSchema, FacultyLevelUncheckedUpdateInputObjectSchema]), where: FacultyLevelWhereUniqueInputObjectSchema  })