import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateWithoutUeInputObjectSchema } from './RetakeCreateWithoutUeInput.schema';
import { RetakeUncheckedCreateWithoutUeInputObjectSchema } from './RetakeUncheckedCreateWithoutUeInput.schema';
import { RetakeCreateOrConnectWithoutUeInputObjectSchema } from './RetakeCreateOrConnectWithoutUeInput.schema';
import { RetakeCreateManyUeInputEnvelopeObjectSchema } from './RetakeCreateManyUeInputEnvelope.schema';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema'

export const RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedCreateNestedManyWithoutUeInput, z.ZodTypeDef, Prisma.RetakeUncheckedCreateNestedManyWithoutUeInput> = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RetakeUncheckedCreateNestedManyWithoutUeInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateWithoutUeInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutUeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyUeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
