import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutCreatedByInputObjectSchema } from './UECreateWithoutCreatedByInput.schema';
import { UEUncheckedCreateWithoutCreatedByInputObjectSchema } from './UEUncheckedCreateWithoutCreatedByInput.schema';
import { UECreateOrConnectWithoutCreatedByInputObjectSchema } from './UECreateOrConnectWithoutCreatedByInput.schema';
import { UECreateManyCreatedByInputEnvelopeObjectSchema } from './UECreateManyCreatedByInputEnvelope.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedManyWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UECreateNestedManyWithoutCreatedByInput, z.ZodTypeDef, Prisma.UECreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UECreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UECreateNestedManyWithoutCreatedByInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => UECreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UECreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UEWhereUniqueInputObjectSchema), z.lazy(() => UEWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
