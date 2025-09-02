import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutRetakesInputObjectSchema } from './UECreateWithoutRetakesInput.schema';
import { UEUncheckedCreateWithoutRetakesInputObjectSchema } from './UEUncheckedCreateWithoutRetakesInput.schema';
import { UECreateOrConnectWithoutRetakesInputObjectSchema } from './UECreateOrConnectWithoutRetakesInput.schema';
import { UEUpsertWithoutRetakesInputObjectSchema } from './UEUpsertWithoutRetakesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateToOneWithWhereWithoutRetakesInputObjectSchema } from './UEUpdateToOneWithWhereWithoutRetakesInput.schema';
import { UEUpdateWithoutRetakesInputObjectSchema } from './UEUpdateWithoutRetakesInput.schema';
import { UEUncheckedUpdateWithoutRetakesInputObjectSchema } from './UEUncheckedUpdateWithoutRetakesInput.schema'

export const UEUpdateOneRequiredWithoutRetakesNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateOneRequiredWithoutRetakesNestedInput, z.ZodTypeDef, Prisma.UEUpdateOneRequiredWithoutRetakesNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutRetakesInputObjectSchema), z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)]).optional()
}).strict();
export const UEUpdateOneRequiredWithoutRetakesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutRetakesInputObjectSchema), z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)]).optional()
}).strict();
