import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutAssignmentsInputObjectSchema } from './UECreateWithoutAssignmentsInput.schema';
import { UEUncheckedCreateWithoutAssignmentsInputObjectSchema } from './UEUncheckedCreateWithoutAssignmentsInput.schema';
import { UECreateOrConnectWithoutAssignmentsInputObjectSchema } from './UECreateOrConnectWithoutAssignmentsInput.schema';
import { UEUpsertWithoutAssignmentsInputObjectSchema } from './UEUpsertWithoutAssignmentsInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema } from './UEUpdateToOneWithWhereWithoutAssignmentsInput.schema';
import { UEUpdateWithoutAssignmentsInputObjectSchema } from './UEUpdateWithoutAssignmentsInput.schema';
import { UEUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './UEUncheckedUpdateWithoutAssignmentsInput.schema'

export const UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateOneRequiredWithoutAssignmentsNestedInput, z.ZodTypeDef, Prisma.UEUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
export const UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
