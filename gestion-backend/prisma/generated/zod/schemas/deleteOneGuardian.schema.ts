import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianIncludeObjectSchema } from './objects/GuardianInclude.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';

export const GuardianDeleteOneSchema = z.object({ select: GuardianSelectObjectSchema.optional(), include: GuardianIncludeObjectSchema.optional(), where: GuardianWhereUniqueInputObjectSchema  })