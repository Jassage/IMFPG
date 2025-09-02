import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutCreatedByInputObjectSchema } from './UECreateWithoutCreatedByInput.schema';
import { UEUncheckedCreateWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateWithoutCreatedByInput.schema'

export const UECreateOrConnectWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutCreatedByInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutCreatedByInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
