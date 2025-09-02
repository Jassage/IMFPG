import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurCreateManyInputObjectSchema } from './objects/ProfesseurCreateManyInput.schema';

export const ProfesseurCreateManyAndReturnSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), data: z.union([ ProfesseurCreateManyInputObjectSchema, z.array(ProfesseurCreateManyInputObjectSchema) ]),  }).strict()