import { z } from 'zod';
import { EnrollmentUpdateManyMutationInputObjectSchema } from './objects/EnrollmentUpdateManyMutationInput.schema';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';

export const EnrollmentUpdateManySchema = z.object({ data: EnrollmentUpdateManyMutationInputObjectSchema, where: EnrollmentWhereInputObjectSchema.optional()  })