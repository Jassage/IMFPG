import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptCreateWithoutGradesInputObjectSchema } from './TranscriptCreateWithoutGradesInput.schema';
import { TranscriptUncheckedCreateWithoutGradesInputObjectSchema } from './TranscriptUncheckedCreateWithoutGradesInput.schema'

export const TranscriptCreateOrConnectWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptCreateOrConnectWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptCreateOrConnectWithoutGradesInput> = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
export const TranscriptCreateOrConnectWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
