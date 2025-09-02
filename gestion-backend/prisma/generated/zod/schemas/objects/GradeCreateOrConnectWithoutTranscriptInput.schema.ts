import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeCreateWithoutTranscriptInputObjectSchema } from './GradeCreateWithoutTranscriptInput.schema';
import { GradeUncheckedCreateWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateWithoutTranscriptInput.schema'

export const GradeCreateOrConnectWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeCreateOrConnectWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeCreateOrConnectWithoutTranscriptInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema)])
}).strict();
export const GradeCreateOrConnectWithoutTranscriptInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutTranscriptInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutTranscriptInputObjectSchema)])
}).strict();
