import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianIncludeObjectSchema } from './objects/GuardianInclude.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';
import { GuardianCreateInputObjectSchema } from './objects/GuardianCreateInput.schema';
import { GuardianUncheckedCreateInputObjectSchema } from './objects/GuardianUncheckedCreateInput.schema';
import { GuardianUpdateInputObjectSchema } from './objects/GuardianUpdateInput.schema';
import { GuardianUncheckedUpdateInputObjectSchema } from './objects/GuardianUncheckedUpdateInput.schema';

export const GuardianUpsertSchema = z.object({ select: GuardianSelectObjectSchema.optional(), include: GuardianIncludeObjectSchema.optional(), where: GuardianWhereUniqueInputObjectSchema, create: z.union([ GuardianCreateInputObjectSchema, GuardianUncheckedCreateInputObjectSchema ]), update: z.union([ GuardianUpdateInputObjectSchema, GuardianUncheckedUpdateInputObjectSchema ])  })