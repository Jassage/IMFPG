import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptScalarWhereInputObjectSchema } from './TranscriptScalarWhereInput.schema';
import { TranscriptUpdateManyMutationInputObjectSchema } from './TranscriptUpdateManyMutationInput.schema';
import { TranscriptUncheckedUpdateManyWithoutStudentInputObjectSchema } from './TranscriptUncheckedUpdateManyWithoutStudentInput.schema'

export const TranscriptUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => TranscriptScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TranscriptUpdateManyMutationInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const TranscriptUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => TranscriptScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TranscriptUpdateManyMutationInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
