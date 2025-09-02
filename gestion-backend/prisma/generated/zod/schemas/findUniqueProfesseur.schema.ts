import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurIncludeObjectSchema } from './objects/ProfesseurInclude.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';

export const ProfesseurFindUniqueSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), include: ProfesseurIncludeObjectSchema.optional(), where: ProfesseurWhereUniqueInputObjectSchema })