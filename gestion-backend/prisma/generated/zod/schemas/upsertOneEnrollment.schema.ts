import { z } from 'zod';
import { EnrollmentSelectObjectSchema } from './objects/EnrollmentSelect.schema';
import { EnrollmentIncludeObjectSchema } from './objects/EnrollmentInclude.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';
import { EnrollmentCreateInputObjectSchema } from './objects/EnrollmentCreateInput.schema';
import { EnrollmentUncheckedCreateInputObjectSchema } from './objects/EnrollmentUncheckedCreateInput.schema';
import { EnrollmentUpdateInputObjectSchema } from './objects/EnrollmentUpdateInput.schema';
import { EnrollmentUncheckedUpdateInputObjectSchema } from './objects/EnrollmentUncheckedUpdateInput.schema';

export const EnrollmentUpsertSchema = z.object({ select: EnrollmentSelectObjectSchema.optional(), include: EnrollmentIncludeObjectSchema.optional(), where: EnrollmentWhereUniqueInputObjectSchema, create: z.union([ EnrollmentCreateInputObjectSchema, EnrollmentUncheckedCreateInputObjectSchema ]), update: z.union([ EnrollmentUpdateInputObjectSchema, EnrollmentUncheckedUpdateInputObjectSchema ])  })