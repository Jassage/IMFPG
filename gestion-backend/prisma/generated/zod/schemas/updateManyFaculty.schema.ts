import { z } from 'zod';
import { FacultyUpdateManyMutationInputObjectSchema } from './objects/FacultyUpdateManyMutationInput.schema';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';

export const FacultyUpdateManySchema = z.object({ data: FacultyUpdateManyMutationInputObjectSchema, where: FacultyWhereInputObjectSchema.optional()  })