import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelIncludeObjectSchema } from './objects/FacultyLevelInclude.schema';
import { FacultyLevelCreateInputObjectSchema } from './objects/FacultyLevelCreateInput.schema';
import { FacultyLevelUncheckedCreateInputObjectSchema } from './objects/FacultyLevelUncheckedCreateInput.schema';

export const FacultyLevelCreateOneSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), include: FacultyLevelIncludeObjectSchema.optional(), data: z.union([FacultyLevelCreateInputObjectSchema, FacultyLevelUncheckedCreateInputObjectSchema])  })