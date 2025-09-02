import { z } from 'zod';
import { FacultySelectObjectSchema } from './objects/FacultySelect.schema';
import { FacultyCreateManyInputObjectSchema } from './objects/FacultyCreateManyInput.schema';

export const FacultyCreateManyAndReturnSchema = z.object({ select: FacultySelectObjectSchema.optional(), data: z.union([ FacultyCreateManyInputObjectSchema, z.array(FacultyCreateManyInputObjectSchema) ]),  }).strict()