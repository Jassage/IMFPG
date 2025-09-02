import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUpdateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput.schema'

export const UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema)]),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema)]),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema)])
}).strict();
