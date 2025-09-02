import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutTranscriptInputObjectSchema } from './GradeCreateWithoutTranscriptInput.schema';
import { GradeUncheckedCreateWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateWithoutTranscriptInput.schema';
import { GradeCreateOrConnectWithoutTranscriptInputObjectSchema } from './GradeCreateOrConnectWithoutTranscriptInput.schema';
import { GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema } from './GradeUpsertWithWhereUniqueWithoutTranscriptInput.schema';
import { GradeCreateManyTranscriptInputEnvelopeObjectSchema } from './GradeCreateManyTranscriptInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema } from './GradeUpdateWithWhereUniqueWithoutTranscriptInput.schema';
import { GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema } from './GradeUpdateManyWithWhereWithoutTranscriptInput.schema';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema'

export const GradeUncheckedUpdateManyWithoutTranscriptNestedInputObjectSchema: z.ZodType<Prisma.GradeUncheckedUpdateManyWithoutTranscriptNestedInput, z.ZodTypeDef, Prisma.GradeUncheckedUpdateManyWithoutTranscriptNestedInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyTranscriptInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GradeUncheckedUpdateManyWithoutTranscriptNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyTranscriptInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
