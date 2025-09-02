import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentUpdateManyMutationInputObjectSchema } from './objects/EnrollmentUpdateManyMutationInput.schema';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';

export const EnrollmentUpdateManyAndReturnSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), data: EnrollmentUpdateManyMutationInputObjectSchema, where: EnrollmentWhereInputObjectSchema.optional()  }).strict()