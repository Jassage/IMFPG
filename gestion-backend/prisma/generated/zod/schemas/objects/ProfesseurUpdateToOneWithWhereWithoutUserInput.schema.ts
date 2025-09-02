import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurUpdateWithoutUserInputObjectSchema } from './ProfesseurUpdateWithoutUserInput.schema';
import { ProfesseurUncheckedUpdateWithoutUserInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutUserInput.schema'

export const ProfesseurUpdateToOneWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateToOneWithWhereWithoutUserInput, z.ZodTypeDef, Prisma.ProfesseurUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const ProfesseurUpdateToOneWithWhereWithoutUserInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
