import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithoutUeInputObjectSchema } from './RetakeUpdateWithoutUeInput.schema';
import { RetakeUncheckedUpdateWithoutUeInputObjectSchema } from './RetakeUncheckedUpdateWithoutUeInput.schema'

export const RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeUpdateWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.RetakeUpdateWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
export const RetakeUpdateWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
