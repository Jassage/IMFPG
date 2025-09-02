import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteIncludeObjectSchema } from './objects/UEPrerequisiteInclude.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';

export const UEPrerequisiteDeleteOneSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), include: UEPrerequisiteIncludeObjectSchema.optional(), where: UEPrerequisiteWhereUniqueInputObjectSchema  })