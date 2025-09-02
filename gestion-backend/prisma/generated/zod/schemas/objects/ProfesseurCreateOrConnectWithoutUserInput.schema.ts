import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurCreateWithoutUserInputObjectSchema } from './ProfesseurCreateWithoutUserInput.schema';
import { ProfesseurUncheckedCreateWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateWithoutUserInput.schema'

export const ProfesseurCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateOrConnectWithoutUserInput, z.ZodTypeDef, Prisma.ProfesseurCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const ProfesseurCreateOrConnectWithoutUserInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
