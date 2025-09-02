import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutRequiredForInputObjectSchema } from './UECreateWithoutRequiredForInput.schema';
import { UEUncheckedCreateWithoutRequiredForInputObjectSchema } from './UEUncheckedCreateWithoutRequiredForInput.schema'

export const UECreateOrConnectWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutRequiredForInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutRequiredForInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutRequiredForInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)])
}).strict();
