import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurUpdateManyMutationInputObjectSchema } from './objects/ProfesseurUpdateManyMutationInput.schema';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';

export const ProfesseurUpdateManyAndReturnSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), data: ProfesseurUpdateManyMutationInputObjectSchema, where: ProfesseurWhereInputObjectSchema.optional()  }).strict()