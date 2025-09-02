import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithoutUeInputObjectSchema } from './UEPrerequisiteUpdateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedUpdateWithoutUeInput.schema'

export const UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
