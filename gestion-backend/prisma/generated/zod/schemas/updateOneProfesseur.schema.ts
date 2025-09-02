import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurIncludeObjectSchema } from './objects/ProfesseurInclude.schema';
import { ProfesseurUpdateInputObjectSchema } from './objects/ProfesseurUpdateInput.schema';
import { ProfesseurUncheckedUpdateInputObjectSchema } from './objects/ProfesseurUncheckedUpdateInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';

export const ProfesseurUpdateOneSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), include: ProfesseurIncludeObjectSchema.optional(), data: z.union([ProfesseurUpdateInputObjectSchema, ProfesseurUncheckedUpdateInputObjectSchema]), where: ProfesseurWhereUniqueInputObjectSchema  })