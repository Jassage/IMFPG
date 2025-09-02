import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateWithoutCreatedByInputObjectSchema } from './UEUpdateWithoutCreatedByInput.schema';
import { UEUncheckedUpdateWithoutCreatedByInputObjectSchema } from './UEUncheckedUpdateWithoutCreatedByInput.schema'

export const UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UEUpdateWithWhereUniqueWithoutCreatedByInput, z.ZodTypeDef, Prisma.UEUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutCreatedByInputObjectSchema)])
}).strict();
export const UEUpdateWithWhereUniqueWithoutCreatedByInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutCreatedByInputObjectSchema)])
}).strict();
