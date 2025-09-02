import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutRequiredForInputObjectSchema } from './UECreateWithoutRequiredForInput.schema';
import { UEUncheckedCreateWithoutRequiredForInputObjectSchema } from './UEUncheckedCreateWithoutRequiredForInput.schema';
import { UECreateOrConnectWithoutRequiredForInputObjectSchema } from './UECreateOrConnectWithoutRequiredForInput.schema';
import { UEUpsertWithoutRequiredForInputObjectSchema } from './UEUpsertWithoutRequiredForInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateToOneWithWhereWithoutRequiredForInputObjectSchema } from './UEUpdateToOneWithWhereWithoutRequiredForInput.schema';
import { UEUpdateWithoutRequiredForInputObjectSchema } from './UEUpdateWithoutRequiredForInput.schema';
import { UEUncheckedUpdateWithoutRequiredForInputObjectSchema } from './UEUncheckedUpdateWithoutRequiredForInput.schema'

export const UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateOneRequiredWithoutRequiredForNestedInput, z.ZodTypeDef, Prisma.UEUpdateOneRequiredWithoutRequiredForNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRequiredForInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutRequiredForInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutRequiredForInputObjectSchema), z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)]).optional()
}).strict();
export const UEUpdateOneRequiredWithoutRequiredForNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRequiredForInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutRequiredForInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutRequiredForInputObjectSchema), z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)]).optional()
}).strict();
