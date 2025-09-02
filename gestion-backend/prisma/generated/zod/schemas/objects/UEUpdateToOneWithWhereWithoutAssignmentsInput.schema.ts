import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { UEUpdateWithoutAssignmentsInputObjectSchema } from './UEUpdateWithoutAssignmentsInput.schema';
import { UEUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './UEUncheckedUpdateWithoutAssignmentsInput.schema'

export const UEUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.UEUpdateToOneWithWhereWithoutAssignmentsInput, z.ZodTypeDef, Prisma.UEUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const UEUpdateToOneWithWhereWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
