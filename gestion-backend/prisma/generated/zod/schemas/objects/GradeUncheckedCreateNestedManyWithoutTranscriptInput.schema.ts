import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutTranscriptInputObjectSchema } from './GradeCreateWithoutTranscriptInput.schema';
import { GradeUncheckedCreateWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateWithoutTranscriptInput.schema';
import { GradeCreateOrConnectWithoutTranscriptInputObjectSchema } from './GradeCreateOrConnectWithoutTranscriptInput.schema';
import { GradeCreateManyTranscriptInputEnvelopeObjectSchema } from './GradeCreateManyTranscriptInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema'

export const GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeUncheckedCreateNestedManyWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeUncheckedCreateNestedManyWithoutTranscriptInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyTranscriptInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutTranscriptInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyTranscriptInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
