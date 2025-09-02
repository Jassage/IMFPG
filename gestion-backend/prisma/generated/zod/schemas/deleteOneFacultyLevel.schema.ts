import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelIncludeObjectSchema } from './objects/FacultyLevelInclude.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';

export const FacultyLevelDeleteOneSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), include: FacultyLevelIncludeObjectSchema.optional(), where: FacultyLevelWhereUniqueInputObjectSchema  })