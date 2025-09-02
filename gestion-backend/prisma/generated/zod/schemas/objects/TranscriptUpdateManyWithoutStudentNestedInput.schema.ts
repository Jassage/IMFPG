import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCreateWithoutStudentInputObjectSchema } from './TranscriptCreateWithoutStudentInput.schema';
import { TranscriptUncheckedCreateWithoutStudentInputObjectSchema } from './TranscriptUncheckedCreateWithoutStudentInput.schema';
import { TranscriptCreateOrConnectWithoutStudentInputObjectSchema } from './TranscriptCreateOrConnectWithoutStudentInput.schema';
import { TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './TranscriptUpsertWithWhereUniqueWithoutStudentInput.schema';
import { TranscriptCreateManyStudentInputEnvelopeObjectSchema } from './TranscriptCreateManyStudentInputEnvelope.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './TranscriptUpdateWithWhereUniqueWithoutStudentInput.schema';
import { TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema } from './TranscriptUpdateManyWithWhereWithoutStudentInput.schema';
import { TranscriptScalarWhereInputObjectSchema } from './TranscriptScalarWhereInput.schema'

export const TranscriptUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.TranscriptUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TranscriptCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TranscriptUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => TranscriptCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TranscriptCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TranscriptWhereUniqueInputObjectSchema), z.lazy(() => TranscriptWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TranscriptScalarWhereInputObjectSchema), z.lazy(() => TranscriptScalarWhereInputObjectSchema).array()]).optional()
}).strict();
