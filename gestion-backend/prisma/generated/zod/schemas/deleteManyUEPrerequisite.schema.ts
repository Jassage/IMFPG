import { z } from 'zod';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';

export const UEPrerequisiteDeleteManySchema = z.object({ where: UEPrerequisiteWhereInputObjectSchema.optional()  })