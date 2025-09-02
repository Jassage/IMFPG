import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateWithoutUeInputObjectSchema } from './UEPrerequisiteCreateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutUeInput.schema';
import { UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema } from './UEPrerequisiteCreateOrConnectWithoutUeInput.schema';
import { UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema } from './UEPrerequisiteCreateManyUeInputEnvelope.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema'

export const UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput> = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
