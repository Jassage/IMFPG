import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianIncludeObjectSchema } from './objects/GuardianInclude.schema';
import { GuardianCreateInputObjectSchema } from './objects/GuardianCreateInput.schema';
import { GuardianUncheckedCreateInputObjectSchema } from './objects/GuardianUncheckedCreateInput.schema';

export const GuardianCreateOneSchema = z.object({ select: GuardianSelectObjectSchema.optional(), include: GuardianIncludeObjectSchema.optional(), data: z.union([GuardianCreateInputObjectSchema, GuardianUncheckedCreateInputObjectSchema])  })