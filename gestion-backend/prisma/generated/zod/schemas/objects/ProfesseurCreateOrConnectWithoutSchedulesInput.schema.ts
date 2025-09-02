import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurCreateWithoutSchedulesInputObjectSchema } from './ProfesseurCreateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutSchedulesInput.schema'

export const ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateOrConnectWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurCreateOrConnectWithoutSchedulesInput> = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)])
}).strict();
export const ProfesseurCreateOrConnectWithoutSchedulesInputObjectZodSchema = z.object({
  where: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)])
}).strict();
