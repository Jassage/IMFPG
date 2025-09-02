import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { UEUpdateWithoutRetakesInputObjectSchema } from './UEUpdateWithoutRetakesInput.schema';
import { UEUncheckedUpdateWithoutRetakesInputObjectSchema } from './UEUncheckedUpdateWithoutRetakesInput.schema'

export const UEUpdateToOneWithWhereWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UEUpdateToOneWithWhereWithoutRetakesInput, z.ZodTypeDef, Prisma.UEUpdateToOneWithWhereWithoutRetakesInput> = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)])
}).strict();
export const UEUpdateToOneWithWhereWithoutRetakesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutRetakesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutRetakesInputObjectSchema)])
}).strict();
