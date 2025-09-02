import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUpdateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInput.schema'

export const UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutPrerequisiteInputObjectSchema)])
}).strict();
