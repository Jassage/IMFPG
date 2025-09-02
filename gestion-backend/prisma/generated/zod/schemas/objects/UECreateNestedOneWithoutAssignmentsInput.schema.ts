import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutAssignmentsInputObjectSchema } from './UECreateWithoutAssignmentsInput.schema';
import { UEUncheckedCreateWithoutAssignmentsInputObjectSchema } from './UEUncheckedCreateWithoutAssignmentsInput.schema';
import { UECreateOrConnectWithoutAssignmentsInputObjectSchema } from './UECreateOrConnectWithoutAssignmentsInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedOneWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.UECreateNestedOneWithoutAssignmentsInput, z.ZodTypeDef, Prisma.UECreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
export const UECreateNestedOneWithoutAssignmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
