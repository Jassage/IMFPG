import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutGradesInputObjectSchema } from './ProfesseurCreateWithoutGradesInput.schema';
import { ProfesseurUncheckedCreateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutGradesInput.schema';
import { ProfesseurCreateOrConnectWithoutGradesInputObjectSchema } from './ProfesseurCreateOrConnectWithoutGradesInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema'

export const ProfesseurCreateNestedOneWithoutGradesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateNestedOneWithoutGradesInput, z.ZodTypeDef, Prisma.ProfesseurCreateNestedOneWithoutGradesInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateNestedOneWithoutGradesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
