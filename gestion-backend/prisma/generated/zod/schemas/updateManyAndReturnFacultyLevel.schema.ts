import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelUpdateManyMutationInputObjectSchema } from './objects/FacultyLevelUpdateManyMutationInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';

export const FacultyLevelUpdateManyAndReturnSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), data: FacultyLevelUpdateManyMutationInputObjectSchema, where: FacultyLevelWhereInputObjectSchema.optional()  }).strict()