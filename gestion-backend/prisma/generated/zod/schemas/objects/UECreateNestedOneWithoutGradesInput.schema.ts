import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutGradesInputObjectSchema } from './UECreateWithoutGradesInput.schema';
import { UEUncheckedCreateWithoutGradesInputObjectSchema } from './UEUncheckedCreateWithoutGradesInput.schema';
import { UECreateOrConnectWithoutGradesInputObjectSchema } from './UECreateOrConnectWithoutGradesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedOneWithoutGradesInputObjectSchema: z.ZodType<Prisma.UECreateNestedOneWithoutGradesInput, z.ZodTypeDef, Prisma.UECreateNestedOneWithoutGradesInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
export const UECreateNestedOneWithoutGradesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
