import { z } from 'zod';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';

export const FacultyDeleteManySchema = z.object({ where: FacultyWhereInputObjectSchema.optional()  })