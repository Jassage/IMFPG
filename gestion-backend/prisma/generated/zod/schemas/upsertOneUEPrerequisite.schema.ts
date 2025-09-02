import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteIncludeObjectSchema } from './objects/UEPrerequisiteInclude.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteCreateInputObjectSchema } from './objects/UEPrerequisiteCreateInput.schema';
import { UEPrerequisiteUncheckedCreateInputObjectSchema } from './objects/UEPrerequisiteUncheckedCreateInput.schema';
import { UEPrerequisiteUpdateInputObjectSchema } from './objects/UEPrerequisiteUpdateInput.schema';
import { UEPrerequisiteUncheckedUpdateInputObjectSchema } from './objects/UEPrerequisiteUncheckedUpdateInput.schema';

export const UEPrerequisiteUpsertSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), include: UEPrerequisiteIncludeObjectSchema.optional(), where: UEPrerequisiteWhereUniqueInputObjectSchema, create: z.union([ UEPrerequisiteCreateInputObjectSchema, UEPrerequisiteUncheckedCreateInputObjectSchema ]), update: z.union([ UEPrerequisiteUpdateInputObjectSchema, UEPrerequisiteUncheckedUpdateInputObjectSchema ])  })