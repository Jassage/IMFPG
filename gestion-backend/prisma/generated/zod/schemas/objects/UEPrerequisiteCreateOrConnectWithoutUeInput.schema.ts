import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteCreateWithoutUeInputObjectSchema } from './UEPrerequisiteCreateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutUeInput.schema'

export const UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateOrConnectWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateOrConnectWithoutUeInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const UEPrerequisiteCreateOrConnectWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
