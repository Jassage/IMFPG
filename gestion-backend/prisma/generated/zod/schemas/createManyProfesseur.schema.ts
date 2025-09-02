import { z } from 'zod';
import { ProfesseurCreateManyInputObjectSchema } from './objects/ProfesseurCreateManyInput.schema';

export const ProfesseurCreateManySchema = z.object({ data: z.union([ ProfesseurCreateManyInputObjectSchema, z.array(ProfesseurCreateManyInputObjectSchema) ]),  })