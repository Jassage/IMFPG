import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { UEUpdateWithoutGradesInputObjectSchema } from './UEUpdateWithoutGradesInput.schema';
import { UEUncheckedUpdateWithoutGradesInputObjectSchema } from './UEUncheckedUpdateWithoutGradesInput.schema'

export const UEUpdateToOneWithWhereWithoutGradesInputObjectSchema: z.ZodType<Prisma.UEUpdateToOneWithWhereWithoutGradesInput, z.ZodTypeDef, Prisma.UEUpdateToOneWithWhereWithoutGradesInput> = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
export const UEUpdateToOneWithWhereWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
