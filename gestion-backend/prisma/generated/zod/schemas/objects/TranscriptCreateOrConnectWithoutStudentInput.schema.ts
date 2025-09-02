import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptCreateWithoutStudentInputObjectSchema } from './TranscriptCreateWithoutStudentInput.schema';
import { TranscriptUncheckedCreateWithoutStudentInputObjectSchema } from './TranscriptUncheckedCreateWithoutStudentInput.schema'

export const TranscriptCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const TranscriptCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TranscriptCreateWithoutStudentInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
