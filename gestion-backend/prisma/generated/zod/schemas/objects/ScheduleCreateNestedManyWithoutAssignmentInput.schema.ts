import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutAssignmentInputObjectSchema } from './ScheduleCreateWithoutAssignmentInput.schema';
import { ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateWithoutAssignmentInput.schema';
import { ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema } from './ScheduleCreateOrConnectWithoutAssignmentInput.schema';
import { ScheduleCreateManyAssignmentInputEnvelopeObjectSchema } from './ScheduleCreateManyAssignmentInputEnvelope.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema'

export const ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleCreateNestedManyWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleCreateNestedManyWithoutAssignmentInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyAssignmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScheduleCreateNestedManyWithoutAssignmentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyAssignmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
