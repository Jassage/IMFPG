import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateWithoutAssignmentsInputObjectSchema } from './UEUpdateWithoutAssignmentsInput.schema';
import { UEUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './UEUncheckedUpdateWithoutAssignmentsInput.schema';
import { UECreateWithoutAssignmentsInputObjectSchema } from './UECreateWithoutAssignmentsInput.schema';
import { UEUncheckedCreateWithoutAssignmentsInputObjectSchema } from './UEUncheckedCreateWithoutAssignmentsInput.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEUpsertWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.UEUpsertWithoutAssignmentsInput, z.ZodTypeDef, Prisma.UEUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEUpsertWithoutAssignmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
