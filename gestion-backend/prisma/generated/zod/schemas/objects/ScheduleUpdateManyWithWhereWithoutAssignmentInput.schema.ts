import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleScalarWhereInputObjectSchema } from './ScheduleScalarWhereInput.schema';
import { ScheduleUpdateManyMutationInputObjectSchema } from './ScheduleUpdateManyMutationInput.schema';
import { ScheduleUncheckedUpdateManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedUpdateManyWithoutAssignmentInput.schema'

export const ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateManyWithWhereWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleUpdateManyWithWhereWithoutAssignmentInput> = z.object({
  where: z.lazy(() => ScheduleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateManyMutationInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateManyWithoutAssignmentInputObjectSchema)])
}).strict();
export const ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateManyMutationInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateManyWithoutAssignmentInputObjectSchema)])
}).strict();
