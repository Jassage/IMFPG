import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateOrConnectWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema } from './UEPrerequisiteCreateManyPrerequisiteInputEnvelope.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema'

export const UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput> = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
