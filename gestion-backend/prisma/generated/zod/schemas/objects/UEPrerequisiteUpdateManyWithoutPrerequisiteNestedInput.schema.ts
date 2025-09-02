import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateOrConnectWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema } from './UEPrerequisiteCreateManyPrerequisiteInputEnvelope.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInput.schema';
import { UEPrerequisiteScalarWhereInputObjectSchema } from './UEPrerequisiteScalarWhereInput.schema'

export const UEPrerequisiteUpdateManyWithoutPrerequisiteNestedInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateManyWithoutPrerequisiteNestedInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateManyWithoutPrerequisiteNestedInput> = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UEPrerequisiteUpdateManyWithoutPrerequisiteNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
