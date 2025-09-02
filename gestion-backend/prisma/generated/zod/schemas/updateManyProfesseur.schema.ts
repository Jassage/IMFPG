import { z } from 'zod';
import { ProfesseurUpdateManyMutationInputObjectSchema } from './objects/ProfesseurUpdateManyMutationInput.schema';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';

export const ProfesseurUpdateManySchema = z.object({ data: ProfesseurUpdateManyMutationInputObjectSchema, where: ProfesseurWhereInputObjectSchema.optional()  })