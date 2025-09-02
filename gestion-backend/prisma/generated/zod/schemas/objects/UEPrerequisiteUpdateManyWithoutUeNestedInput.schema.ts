import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateWithoutUeInputObjectSchema } from './UEPrerequisiteCreateWithoutUeInput.schema';
import { UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateWithoutUeInput.schema';
import { UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema } from './UEPrerequisiteCreateOrConnectWithoutUeInput.schema';
import { UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema } from './UEPrerequisiteUpsertWithWhereUniqueWithoutUeInput.schema';
import { UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema } from './UEPrerequisiteCreateManyUeInputEnvelope.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema } from './UEPrerequisiteUpdateWithWhereUniqueWithoutUeInput.schema';
import { UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema } from './UEPrerequisiteUpdateManyWithWhereWithoutUeInput.schema';
import { UEPrerequisiteScalarWhereInputObjectSchema } from './UEPrerequisiteScalarWhereInput.schema'

export const UEPrerequisiteUpdateManyWithoutUeNestedInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateManyWithoutUeNestedInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateManyWithoutUeNestedInput> = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UEPrerequisiteUpdateManyWithoutUeNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateWithoutUeInputObjectSchema).array(), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema), z.lazy(() => UEPrerequisiteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
