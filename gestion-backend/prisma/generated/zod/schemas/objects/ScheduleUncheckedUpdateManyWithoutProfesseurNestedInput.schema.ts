import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutProfesseurInputObjectSchema } from './ScheduleCreateWithoutProfesseurInput.schema';
import { ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateWithoutProfesseurInput.schema';
import { ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema } from './ScheduleCreateOrConnectWithoutProfesseurInput.schema';
import { ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema } from './ScheduleUpsertWithWhereUniqueWithoutProfesseurInput.schema';
import { ScheduleCreateManyProfesseurInputEnvelopeObjectSchema } from './ScheduleCreateManyProfesseurInputEnvelope.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema } from './ScheduleUpdateWithWhereUniqueWithoutProfesseurInput.schema';
import { ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema } from './ScheduleUpdateManyWithWhereWithoutProfesseurInput.schema';
import { ScheduleScalarWhereInputObjectSchema } from './ScheduleScalarWhereInput.schema'

export const ScheduleUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedUpdateManyWithoutProfesseurNestedInput, z.ZodTypeDef, Prisma.ScheduleUncheckedUpdateManyWithoutProfesseurNestedInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScheduleUncheckedUpdateManyWithoutProfesseurNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
