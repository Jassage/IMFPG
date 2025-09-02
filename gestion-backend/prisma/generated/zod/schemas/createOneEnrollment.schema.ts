import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentIncludeObjectSchema } from './objects/EnrollmentInclude.schema';
import { EnrollmentCreateInputObjectSchema } from './objects/EnrollmentCreateInput.schema';
import { EnrollmentUncheckedCreateInputObjectSchema } from './objects/EnrollmentUncheckedCreateInput.schema';

export const EnrollmentCreateOneSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), include: EnrollmentIncludeObjectSchema.optional(), data: z.union([EnrollmentCreateInputObjectSchema, EnrollmentUncheckedCreateInputObjectSchema])  })