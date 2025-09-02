import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutRetakesInputObjectSchema } from './UECreateWithoutRetakesInput.schema';
import { UEUncheckedCreateWithoutRetakesInputObjectSchema } from './UEUncheckedCreateWithoutRetakesInput.schema';
import { UECreateOrConnectWithoutRetakesInputObjectSchema } from './UECreateOrConnectWithoutRetakesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedOneWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UECreateNestedOneWithoutRetakesInput, z.ZodTypeDef, Prisma.UECreateNestedOneWithoutRetakesInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
export const UECreateNestedOneWithoutRetakesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
