import { z } from 'zod';
import { FacultyLevelUpdateManyMutationInputObjectSchema } from './objects/FacultyLevelUpdateManyMutationInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';

export const FacultyLevelUpdateManySchema = z.object({ data: FacultyLevelUpdateManyMutationInputObjectSchema, where: FacultyLevelWhereInputObjectSchema.optional()  })