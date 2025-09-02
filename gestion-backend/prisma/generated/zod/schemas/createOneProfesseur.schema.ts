import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurIncludeObjectSchema } from './objects/ProfesseurInclude.schema';
import { ProfesseurCreateInputObjectSchema } from './objects/ProfesseurCreateInput.schema';
import { ProfesseurUncheckedCreateInputObjectSchema } from './objects/ProfesseurUncheckedCreateInput.schema';

export const ProfesseurCreateOneSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), include: ProfesseurIncludeObjectSchema.optional(), data: z.union([ProfesseurCreateInputObjectSchema, ProfesseurUncheckedCreateInputObjectSchema])  })