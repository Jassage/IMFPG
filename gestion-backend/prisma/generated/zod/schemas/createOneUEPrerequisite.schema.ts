import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteIncludeObjectSchema } from './objects/UEPrerequisiteInclude.schema';
import { UEPrerequisiteCreateInputObjectSchema } from './objects/UEPrerequisiteCreateInput.schema';
import { UEPrerequisiteUncheckedCreateInputObjectSchema } from './objects/UEPrerequisiteUncheckedCreateInput.schema';

export const UEPrerequisiteCreateOneSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), include: UEPrerequisiteIncludeObjectSchema.optional(), data: z.union([UEPrerequisiteCreateInputObjectSchema, UEPrerequisiteUncheckedCreateInputObjectSchema])  })