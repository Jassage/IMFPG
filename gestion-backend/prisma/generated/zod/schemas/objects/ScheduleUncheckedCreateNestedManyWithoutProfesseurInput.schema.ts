import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutProfesseurInputObjectSchema } from './ScheduleCreateWithoutProfesseurInput.schema';
import { ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateWithoutProfesseurInput.schema';
import { ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema } from './ScheduleCreateOrConnectWithoutProfesseurInput.schema';
import { ScheduleCreateManyProfesseurInputEnvelopeObjectSchema } from './ScheduleCreateManyProfesseurInputEnvelope.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema'

export const ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedCreateNestedManyWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUncheckedCreateNestedManyWithoutProfesseurInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScheduleUncheckedCreateNestedManyWithoutProfesseurInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
