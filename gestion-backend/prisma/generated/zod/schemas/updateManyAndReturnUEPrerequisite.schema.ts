import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteUpdateManyMutationInputObjectSchema } from './objects/UEPrerequisiteUpdateManyMutationInput.schema';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';

export const UEPrerequisiteUpdateManyAndReturnSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), data: UEPrerequisiteUpdateManyMutationInputObjectSchema, where: UEPrerequisiteWhereInputObjectSchema.optional()  }).strict()