import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurUpdateWithoutGradesInputObjectSchema } from './ProfesseurUpdateWithoutGradesInput.schema';
import { ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutGradesInput.schema';
import { ProfesseurCreateWithoutGradesInputObjectSchema } from './ProfesseurCreateWithoutGradesInput.schema';
import { ProfesseurUncheckedCreateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutGradesInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurUpsertWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurUpsertWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurUpsertWithoutGradesInput> = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
export const ProfesseurUpsertWithoutGradesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
