import { z } from 'zod';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';

export const EnrollmentDeleteManySchema = z.object({ where: EnrollmentWhereInputObjectSchema.optional()  })