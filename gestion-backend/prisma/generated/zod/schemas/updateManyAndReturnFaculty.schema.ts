import { z } from 'zod';
import { FacultySelectObjectSchema } from './objects/FacultySelect.schema';
import { FacultyUpdateManyMutationInputObjectSchema } from './objects/FacultyUpdateManyMutationInput.schema';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';

export const FacultyUpdateManyAndReturnSchema = z.object({ select: FacultySelectObjectSchema.optional(), data: FacultyUpdateManyMutationInputObjectSchema, where: FacultyWhereInputObjectSchema.optional()  }).strict()