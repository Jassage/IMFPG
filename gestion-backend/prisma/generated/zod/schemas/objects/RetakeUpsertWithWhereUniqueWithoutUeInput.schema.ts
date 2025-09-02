import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithoutUeInputObjectSchema } from './RetakeUpdateWithoutUeInput.schema';
import { RetakeUncheckedUpdateWithoutUeInputObjectSchema } from './RetakeUncheckedUpdateWithoutUeInput.schema';
import { RetakeCreateWithoutUeInputObjectSchema } from './RetakeCreateWithoutUeInput.schema';
import { RetakeUncheckedCreateWithoutUeInputObjectSchema } from './RetakeUncheckedCreateWithoutUeInput.schema'

export const RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeUpsertWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.RetakeUpsertWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RetakeUpdateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const RetakeUpsertWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RetakeUpdateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
