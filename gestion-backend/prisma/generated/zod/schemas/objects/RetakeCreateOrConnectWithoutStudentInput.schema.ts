import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema';
import { RetakeCreateWithoutStudentInputObjectSchema } from './RetakeCreateWithoutStudentInput.schema';
import { RetakeUncheckedCreateWithoutStudentInputObjectSchema } from './RetakeUncheckedCreateWithoutStudentInput.schema'

export const RetakeCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const RetakeCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
