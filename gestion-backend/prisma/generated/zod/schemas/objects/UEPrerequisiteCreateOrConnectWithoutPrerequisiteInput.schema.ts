import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput.schema'

export const UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateOrConnectWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateOrConnectWithoutPrerequisiteInput> = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema)])
}).strict();
export const UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema)])
}).strict();
