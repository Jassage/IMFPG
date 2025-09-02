import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentIncludeObjectSchema } from './objects/EnrollmentInclude.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';

export const EnrollmentFindUniqueOrThrowSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), include: EnrollmentIncludeObjectSchema.optional(), where: EnrollmentWhereUniqueInputObjectSchema })