import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptUpdateWithoutStudentInputObjectSchema } from './TranscriptUpdateWithoutStudentInput.schema';
import { TranscriptUncheckedUpdateWithoutStudentInputObjectSchema } from './TranscriptUncheckedUpdateWithoutStudentInput.schema'

export const TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TranscriptUpdateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const TranscriptUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TranscriptUpdateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
