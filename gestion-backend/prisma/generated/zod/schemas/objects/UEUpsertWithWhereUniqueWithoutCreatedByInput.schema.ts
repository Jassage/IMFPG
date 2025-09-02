import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateWithoutCreatedByInputObjectSchema } from './UEUpdateWithoutCreatedByInput.schema';
import { UEUncheckedUpdateWithoutCreatedByInputObjectSchema } from './UEUncheckedUpdateWithoutCreatedByInput.schema';
import { UECreateWithoutCreatedByInputObjectSchema } from './UECreateWithoutCreatedByInput.schema';
import { UEUncheckedCreateWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateWithoutCreatedByInput.schema'

export const UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UEUpsertWithWhereUniqueWithoutCreatedByInput, z.ZodTypeDef, Prisma.UEUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutCreatedByInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
export const UEUpsertWithWhereUniqueWithoutCreatedByInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutCreatedByInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
