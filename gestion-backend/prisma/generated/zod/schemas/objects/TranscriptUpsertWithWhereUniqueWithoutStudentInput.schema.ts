import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptUpdateWithoutStudentInputObjectSchema } from './TranscriptUpdateWithoutStudentInput.schema';
import { TranscriptUncheckedUpdateWithoutStudentInputObjectSchema } from './TranscriptUncheckedUpdateWithoutStudentInput.schema';
import { TranscriptCreateWithoutStudentInputObjectSchema } from './TranscriptCreateWithoutStudentInput.schema';
import { TranscriptUncheckedCreateWithoutStudentInputObjectSchema } from './TranscriptUncheckedCreateWithoutStudentInput.schema'

export const TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TranscriptUpdateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const TranscriptUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TranscriptUpdateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
