import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeCreateWithoutUeInputObjectSchema } from './RetakeCreateWithoutUeInput.schema';
import { RetakeUncheckedCreateWithoutUeInputObjectSchema } from './RetakeUncheckedCreateWithoutUeInput.schema'

export const RetakeCreateOrConnectWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeCreateOrConnectWithoutUeInput, z.ZodTypeDef, Prisma.RetakeCreateOrConnectWithoutUeInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const RetakeCreateOrConnectWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RetakeCreateWithoutUeInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
