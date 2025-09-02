import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateWithoutRequiredForInputObjectSchema } from './UEUpdateWithoutRequiredForInput.schema';
import { UEUncheckedUpdateWithoutRequiredForInputObjectSchema } from './UEUncheckedUpdateWithoutRequiredForInput.schema';
import { UECreateWithoutRequiredForInputObjectSchema } from './UECreateWithoutRequiredForInput.schema';
import { UEUncheckedCreateWithoutRequiredForInputObjectSchema } from './UEUncheckedCreateWithoutRequiredForInput.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEUpsertWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UEUpsertWithoutRequiredForInput, z.ZodTypeDef, Prisma.UEUpsertWithoutRequiredForInput> = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEUpsertWithoutRequiredForInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutRequiredForInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
