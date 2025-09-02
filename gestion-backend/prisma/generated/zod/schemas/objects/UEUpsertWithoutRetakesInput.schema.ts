import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateWithoutRetakesInputObjectSchema } from './UEUpdateWithoutRetakesInput.schema';
import { UEUncheckedUpdateWithoutRetakesInputObjectSchema } from './UEUncheckedUpdateWithoutRetakesInput.schema';
import { UECreateWithoutRetakesInputObjectSchema } from './UECreateWithoutRetakesInput.schema';
import { UEUncheckedCreateWithoutRetakesInputObjectSchema } from './UEUncheckedCreateWithoutRetakesInput.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEUpsertWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UEUpsertWithoutRetakesInput, z.ZodTypeDef, Prisma.UEUpsertWithoutRetakesInput> = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEUpsertWithoutRetakesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRetakesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
