import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithoutUeInputObjectSchema } from './UEPrerequisiteUpdateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedUpdateWithoutUeInput.schema';
import { UEPrerequisiteCreateWithoutUeInputObjectSchema } from './UEPrerequisiteCreateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutUeInput.schema'

export const UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpsertWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpsertWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
