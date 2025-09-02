import { z } from 'zod';
import { ProfesseurSelectObjectSchema } from './objects/ProfesseurSelect.schema';
import { ProfesseurIncludeObjectSchema } from './objects/ProfesseurInclude.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';
import { ProfesseurCreateInputObjectSchema } from './objects/ProfesseurCreateInput.schema';
import { ProfesseurUncheckedCreateInputObjectSchema } from './objects/ProfesseurUncheckedCreateInput.schema';
import { ProfesseurUpdateInputObjectSchema } from './objects/ProfesseurUpdateInput.schema';
import { ProfesseurUncheckedUpdateInputObjectSchema } from './objects/ProfesseurUncheckedUpdateInput.schema';

export const ProfesseurUpsertSchema = z.object({ select: ProfesseurSelectObjectSchema.optional(), include: ProfesseurIncludeObjectSchema.optional(), where: ProfesseurWhereUniqueInputObjectSchema, create: z.union([ ProfesseurCreateInputObjectSchema, ProfesseurUncheckedCreateInputObjectSchema ]), update: z.union([ ProfesseurUpdateInputObjectSchema, ProfesseurUncheckedUpdateInputObjectSchema ])  })