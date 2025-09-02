import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentIncludeObjectSchema } from './objects/EnrollmentInclude.schema';
import { EnrollmentUpdateInputObjectSchema } from './objects/EnrollmentUpdateInput.schema';
import { EnrollmentUncheckedUpdateInputObjectSchema } from './objects/EnrollmentUncheckedUpdateInput.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';

export const EnrollmentUpdateOneSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), include: EnrollmentIncludeObjectSchema.optional(), data: z.union([EnrollmentUpdateInputObjectSchema, EnrollmentUncheckedUpdateInputObjectSchema]), where: EnrollmentWhereUniqueInputObjectSchema  })