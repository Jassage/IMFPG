import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteIncludeObjectSchema } from './objects/UEPrerequisiteInclude.schema';
import { UEPrerequisiteUpdateInputObjectSchema } from './objects/UEPrerequisiteUpdateInput.schema';
import { UEPrerequisiteUncheckedUpdateInputObjectSchema } from './objects/UEPrerequisiteUncheckedUpdateInput.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';

export const UEPrerequisiteUpdateOneSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), include: UEPrerequisiteIncludeObjectSchema.optional(), data: z.union([UEPrerequisiteUpdateInputObjectSchema, UEPrerequisiteUncheckedUpdateInputObjectSchema]), where: UEPrerequisiteWhereUniqueInputObjectSchema  })