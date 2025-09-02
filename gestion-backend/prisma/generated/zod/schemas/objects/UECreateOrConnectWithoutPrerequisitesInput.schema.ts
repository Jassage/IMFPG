import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutPrerequisitesInputObjectSchema } from './UECreateWithoutPrerequisitesInput.schema';
import { UEUncheckedCreateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedCreateWithoutPrerequisitesInput.schema'

export const UECreateOrConnectWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutPrerequisitesInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutPrerequisitesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)])
}).strict();
