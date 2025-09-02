import { z } from 'zod';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';

export const FacultyLevelDeleteManySchema = z.object({ where: FacultyLevelWhereInputObjectSchema.optional()  })