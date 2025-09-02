import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutTranscriptInputObjectSchema } from './GradeUpdateWithoutTranscriptInput.schema';
import { GradeUncheckedUpdateWithoutTranscriptInputObjectSchema } from './GradeUncheckedUpdateWithoutTranscriptInput.schema'

export const GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeUpdateWithWhereUniqueWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeUpdateWithWhereUniqueWithoutTranscriptInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutTranscriptInputObjectSchema)])
}).strict();
export const GradeUpdateWithWhereUniqueWithoutTranscriptInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutTranscriptInputObjectSchema)])
}).strict();
