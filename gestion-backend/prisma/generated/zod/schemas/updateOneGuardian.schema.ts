import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianIncludeObjectSchema } from './objects/GuardianInclude.schema';
import { GuardianUpdateInputObjectSchema } from './objects/GuardianUpdateInput.schema';
import { GuardianUncheckedUpdateInputObjectSchema } from './objects/GuardianUncheckedUpdateInput.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';

export const GuardianUpdateOneSchema = z.object({ select: GuardianSelectObjectSchema.optional(), include: GuardianIncludeObjectSchema.optional(), data: z.union([GuardianUpdateInputObjectSchema, GuardianUncheckedUpdateInputObjectSchema]), where: GuardianWhereUniqueInputObjectSchema  })