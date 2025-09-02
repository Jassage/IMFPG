import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurUpdateWithoutGradesInputObjectSchema } from './ProfesseurUpdateWithoutGradesInput.schema';
import { ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutGradesInput.schema'

export const ProfesseurUpdateToOneWithWhereWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateToOneWithWhereWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurUpdateToOneWithWhereWithoutGradesInput> = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
export const ProfesseurUpdateToOneWithWhereWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
