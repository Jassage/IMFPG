import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutTranscriptInputObjectSchema } from './GradeUpdateWithoutTranscriptInput.schema';
import { GradeUncheckedUpdateWithoutTranscriptInputObjectSchema } from './GradeUncheckedUpdateWithoutTranscriptInput.schema';
import { GradeCreateWithoutTranscriptInputObjectSchema } from './GradeCreateWithoutTranscriptInput.schema';
import { GradeUncheckedCreateWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateWithoutTranscriptInput.schema'

export const GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeUpsertWithWhereUniqueWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeUpsertWithWhereUniqueWithoutTranscriptInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutTranscriptInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema)])
}).strict();
export const GradeUpsertWithWhereUniqueWithoutTranscriptInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutTranscriptInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema)])
}).strict();
