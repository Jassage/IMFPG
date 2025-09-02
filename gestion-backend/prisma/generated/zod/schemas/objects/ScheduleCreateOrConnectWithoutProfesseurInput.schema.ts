import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleCreateWithoutProfesseurInputObjectSchema } from './ScheduleCreateWithoutProfesseurInput.schema';
import { ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateWithoutProfesseurInput.schema'

export const ScheduleCreateOrConnectWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleCreateOrConnectWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleCreateOrConnectWithoutProfesseurInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const ScheduleCreateOrConnectWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
