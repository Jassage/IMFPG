import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema';
import { TranscriptUpdateWithoutGradesInputObjectSchema } from './TranscriptUpdateWithoutGradesInput.schema';
import { TranscriptUncheckedUpdateWithoutGradesInputObjectSchema } from './TranscriptUncheckedUpdateWithoutGradesInput.schema'

export const TranscriptUpdateToOneWithWhereWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateToOneWithWhereWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptUpdateToOneWithWhereWithoutGradesInput> = z.object({
  where: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
export const TranscriptUpdateToOneWithWhereWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
