import { z } from 'zod';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';

export const ProfesseurDeleteManySchema = z.object({ where: ProfesseurWhereInputObjectSchema.optional()  })