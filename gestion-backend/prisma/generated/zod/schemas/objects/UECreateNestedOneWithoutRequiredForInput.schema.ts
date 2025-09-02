import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutRequiredForInputObjectSchema } from './UECreateWithoutRequiredForInput.schema';
import { UEUncheckedCreateWithoutRequiredForInputObjectSchema } from './UEUncheckedCreateWithoutRequiredForInput.schema';
import { UECreateOrConnectWithoutRequiredForInputObjectSchema } from './UECreateOrConnectWithoutRequiredForInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedOneWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UECreateNestedOneWithoutRequiredForInput, z.ZodTypeDef, Prisma.UECreateNestedOneWithoutRequiredForInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRequiredForInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
export const UECreateNestedOneWithoutRequiredForInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRequiredForInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
