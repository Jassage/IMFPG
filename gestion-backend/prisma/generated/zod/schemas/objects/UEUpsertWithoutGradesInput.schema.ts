import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateWithoutGradesInputObjectSchema } from './UEUpdateWithoutGradesInput.schema';
import { UEUncheckedUpdateWithoutGradesInputObjectSchema } from './UEUncheckedUpdateWithoutGradesInput.schema';
import { UECreateWithoutGradesInputObjectSchema } from './UECreateWithoutGradesInput.schema';
import { UEUncheckedCreateWithoutGradesInputObjectSchema } from './UEUncheckedCreateWithoutGradesInput.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEUpsertWithoutGradesInputObjectSchema: z.ZodType<Prisma.UEUpsertWithoutGradesInput, z.ZodTypeDef, Prisma.UEUpsertWithoutGradesInput> = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEUpsertWithoutGradesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
