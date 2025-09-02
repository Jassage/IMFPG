import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateWithoutStudentInputObjectSchema } from './RetakeCreateWithoutStudentInput.schema';
import { RetakeUncheckedCreateWithoutStudentInputObjectSchema } from './RetakeUncheckedCreateWithoutStudentInput.schema';
import { RetakeCreateOrConnectWithoutStudentInputObjectSchema } from './RetakeCreateOrConnectWithoutStudentInput.schema';
import { RetakeCreateManyStudentInputEnvelopeObjectSchema } from './RetakeCreateManyStudentInputEnvelope.schema';
import { RetakeWhereUniqueInputObjectSchema } from './RetakeWhereUniqueInput.schema'

export const RetakeCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RetakeCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => RetakeUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => RetakeCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RetakeCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RetakeWhereUniqueInputObjectSchema), z.lazy(() => RetakeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
