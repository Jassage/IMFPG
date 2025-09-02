import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './GradeUpdateManyMutationInput.schema';
import { GradeUncheckedUpdateManyWithoutTranscriptInputObjectSchema } from './GradeUncheckedUpdateManyWithoutTranscriptInput.schema'

export const GradeUpdateManyWithWhereWithoutTranscriptInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithWhereWithoutTranscriptInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithWhereWithoutTranscriptInput> = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutTranscriptInputObjectSchema)])
}).strict();
export const GradeUpdateManyWithWhereWithoutTranscriptInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutTranscriptInputObjectSchema)])
}).strict();
