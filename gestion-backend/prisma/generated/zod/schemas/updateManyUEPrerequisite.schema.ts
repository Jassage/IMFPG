import { z } from 'zod';
import { UEPrerequisiteUpdateManyMutationInputObjectSchema } from './objects/UEPrerequisiteUpdateManyMutationInput.schema';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';

export const UEPrerequisiteUpdateManySchema = z.object({ data: UEPrerequisiteUpdateManyMutationInputObjectSchema, where: UEPrerequisiteWhereInputObjectSchema.optional()  })