import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutRetakesInputObjectSchema } from './UECreateWithoutRetakesInput.schema';
import { UEUncheckedCreateWithoutRetakesInputObjectSchema } from './UEUncheckedCreateWithoutRetakesInput.schema'

export const UECreateOrConnectWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutRetakesInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutRetakesInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutRetakesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)])
}).strict();
