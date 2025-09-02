import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurCreateWithoutGradesInputObjectSchema } from './ProfesseurCreateWithoutGradesInput.schema';
import { ProfesseurUncheckedCreateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutGradesInput.schema'

export const ProfesseurCreateOrConnectWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateOrConnectWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurCreateOrConnectWithoutGradesInput> = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
export const ProfesseurCreateOrConnectWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
