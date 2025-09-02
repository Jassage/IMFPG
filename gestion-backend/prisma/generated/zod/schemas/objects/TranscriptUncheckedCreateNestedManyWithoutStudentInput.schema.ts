import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCreateWithoutStudentInputObjectSchema } from './TranscriptCreateWithoutStudentInput.schema';
import { TranscriptUncheckedCreateWithoutStudentInputObjectSchema } from './TranscriptUncheckedCreateWithoutStudentInput.schema';
import { TranscriptCreateOrConnectWithoutStudentInputObjectSchema } from './TranscriptCreateOrConnectWithoutStudentInput.schema';
import { TranscriptCreateManyStudentInputEnvelopeObjectSchema } from './TranscriptCreateManyStudentInputEnvelope.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema'

export const TranscriptUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TranscriptCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TranscriptUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TranscriptCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
