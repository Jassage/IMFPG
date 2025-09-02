import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutCreatedByInputObjectSchema } from './UECreateWithoutCreatedByInput.schema';
import { UEUncheckedCreateWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateWithoutCreatedByInput.schema';
import { UECreateOrConnectWithoutCreatedByInputObjectSchema } from './UECreateOrConnectWithoutCreatedByInput.schema';
import { UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema } from './UEUpsertWithWhereUniqueWithoutCreatedByInput.schema';
import { UECreateManyCreatedByInputEnvelopeObjectSchema } from './UECreateManyCreatedByInputEnvelope.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema } from './UEUpdateWithWhereUniqueWithoutCreatedByInput.schema';
import { UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema } from './UEUpdateManyWithWhereWithoutCreatedByInput.schema';
import { UEScalarWhereInputObjectSchema } from './UEScalarWhereInput.schema'

export const UEUpdateManyWithoutCreatedByNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateManyWithoutCreatedByNestedInput, z.ZodTypeDef, Prisma.UEUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UECreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UEUpdateManyWithoutCreatedByNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UECreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema), z.lazy(() => UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UEScalarWhereInputObjectSchema), z.lazy(() => UEScalarWhereInputObjectSchema).array()]).optional()
}).strict();
