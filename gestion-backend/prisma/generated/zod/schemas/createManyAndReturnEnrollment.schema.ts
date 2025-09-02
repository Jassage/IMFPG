import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentCreateManyInputObjectSchema } from './objects/EnrollmentCreateManyInput.schema';

export const EnrollmentCreateManyAndReturnSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), data: z.union([ EnrollmentCreateManyInputObjectSchema, z.array(EnrollmentCreateManyInputObjectSchema) ]),  }).strict()