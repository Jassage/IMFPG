import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateWithoutUeInputObjectSchema } from './RetakeCreateWithoutUeInput.schema';
import { RetakeUncheckedCreateWithoutUeInputObjectSchema } from './RetakeUncheckedCreateWithoutUeInput.schema';
import { RetakeCreateOrConnectWithoutUeInputObjectSchema } from './RetakeCreateOrConnectWithoutUeInput.schema';
import { RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema } from './RetakeUpsertWithWhereUniqueWithoutUeInput.schema';
import { RetakeCreateManyUeInputEnvelopeObjectSchema } from './RetakeCreateManyUeInputEnvelope.schema';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema } from './RetakeUpdateWithWhereUniqueWithoutUeInput.schema';
import { RetakeUpdateManyWithWhereWithoutUeInputObjectSchema } from './RetakeUpdateManyWithWhereWithoutUeInput.schema';
import { RetakeScalarWhereInputObjectSchema } from './RetakeScalarWhereInput.schema'

export const RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedUpdateManyWithoutUeNestedInput, z.ZodTypeDef, Prisma.RetakeUncheckedUpdateManyWithoutUeNestedInput> = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RetakeUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => RetakeUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RetakeUncheckedUpdateManyWithoutUeNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => RetakeUpsertWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyUeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema), z.lazy(() => RetakeUpdateWithWhereUniqueWithoutUeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RetakeUpdateManyWithWhereWithoutUeInputObjectSchema), z.lazy(() => RetakeUpdateManyWithWhereWithoutUeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RetakeScalarWhereInputObjectSchema), z.lazy(() => RetakeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
