import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptUpdateWithoutGradesInputObjectSchema } from './TranscriptUpdateWithoutGradesInput.schema';
import { TranscriptUncheckedUpdateWithoutGradesInputObjectSchema } from './TranscriptUncheckedUpdateWithoutGradesInput.schema';
import { TranscriptCreateWithoutGradesInputObjectSchema } from './TranscriptCreateWithoutGradesInput.schema';
import { TranscriptUncheckedCreateWithoutGradesInputObjectSchema } from './TranscriptUncheckedCreateWithoutGradesInput.schema';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema'

export const TranscriptUpsertWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptUpsertWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptUpsertWithoutGradesInput> = z.object({
  update: z.union([z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => TranscriptWhereInputObjectSchema).optional()
}).strict();
export const TranscriptUpsertWithoutGradesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => TranscriptWhereInputObjectSchema).optional()
}).strict();
