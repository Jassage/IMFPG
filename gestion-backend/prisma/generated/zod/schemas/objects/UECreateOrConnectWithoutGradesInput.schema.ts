import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutGradesInputObjectSchema } from './UECreateWithoutGradesInput.schema';
import { UEUncheckedCreateWithoutGradesInputObjectSchema } from './UEUncheckedCreateWithoutGradesInput.schema'

export const UECreateOrConnectWithoutGradesInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutGradesInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutGradesInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
