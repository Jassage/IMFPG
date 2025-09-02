import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { UEUpdateWithoutRequiredForInputObjectSchema } from './UEUpdateWithoutRequiredForInput.schema';
import { UEUncheckedUpdateWithoutRequiredForInputObjectSchema } from './UEUncheckedUpdateWithoutRequiredForInput.schema'

export const UEUpdateToOneWithWhereWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UEUpdateToOneWithWhereWithoutRequiredForInput, z.ZodTypeDef, Prisma.UEUpdateToOneWithWhereWithoutRequiredForInput> = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)])
}).strict();
export const UEUpdateToOneWithWhereWithoutRequiredForInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutRequiredForInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRequiredForInputObjectSchema)])
}).strict();
