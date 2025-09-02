import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UECreateWithoutAssignmentsInputObjectSchema } from './UECreateWithoutAssignmentsInput.schema';
import { UEUncheckedCreateWithoutAssignmentsInputObjectSchema } from './UEUncheckedCreateWithoutAssignmentsInput.schema'

export const UECreateOrConnectWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.UECreateOrConnectWithoutAssignmentsInput, z.ZodTypeDef, Prisma.UECreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const UECreateOrConnectWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
