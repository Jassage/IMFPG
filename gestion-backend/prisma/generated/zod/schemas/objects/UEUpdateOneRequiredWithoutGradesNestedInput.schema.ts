import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutGradesInputObjectSchema } from './UECreateWithoutGradesInput.schema';
import { UEUncheckedCreateWithoutGradesInputObjectSchema } from './UEUncheckedCreateWithoutGradesInput.schema';
import { UECreateOrConnectWithoutGradesInputObjectSchema } from './UECreateOrConnectWithoutGradesInput.schema';
import { UEUpsertWithoutGradesInputObjectSchema } from './UEUpsertWithoutGradesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateToOneWithWhereWithoutGradesInputObjectSchema } from './UEUpdateToOneWithWhereWithoutGradesInput.schema';
import { UEUpdateWithoutGradesInputObjectSchema } from './UEUpdateWithoutGradesInput.schema';
import { UEUncheckedUpdateWithoutGradesInputObjectSchema } from './UEUncheckedUpdateWithoutGradesInput.schema'

export const UEUpdateOneRequiredWithoutGradesNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateOneRequiredWithoutGradesNestedInput, z.ZodTypeDef, Prisma.UEUpdateOneRequiredWithoutGradesNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
export const UEUpdateOneRequiredWithoutGradesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => UEUpdateWithoutGradesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
