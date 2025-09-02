import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCreateWithoutGradesInputObjectSchema } from './TranscriptCreateWithoutGradesInput.schema';
import { TranscriptUncheckedCreateWithoutGradesInputObjectSchema } from './TranscriptUncheckedCreateWithoutGradesInput.schema';
import { TranscriptCreateOrConnectWithoutGradesInputObjectSchema } from './TranscriptCreateOrConnectWithoutGradesInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema'

export const TranscriptCreateNestedOneWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptCreateNestedOneWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptCreateNestedOneWithoutGradesInput> = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TranscriptCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => TranscriptWhereUniqueInputObjectSchema).optional()
}).strict();
export const TranscriptCreateNestedOneWithoutGradesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TranscriptCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => TranscriptWhereUniqueInputObjectSchema).optional()
}).strict();
