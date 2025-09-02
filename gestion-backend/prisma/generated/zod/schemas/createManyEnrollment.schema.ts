import { z } from 'zod';
import { EnrollmentCreateManyInputObjectSchema } from './objects/EnrollmentCreateManyInput.schema';

export const EnrollmentCreateManySchema = z.object({ data: z.union([ EnrollmentCreateManyInputObjectSchema, z.array(EnrollmentCreateManyInputObjectSchema) ]),  })