import { z } from 'zod';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';

export const UEDeleteManySchema = z.object({ where: UEWhereInputObjectSchema.optional()  })