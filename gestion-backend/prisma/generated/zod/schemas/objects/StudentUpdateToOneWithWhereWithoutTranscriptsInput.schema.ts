import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutTranscriptsInputObjectSchema } from './StudentUpdateWithoutTranscriptsInput.schema';
import { StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedUpdateWithoutTranscriptsInput.schema'

export const StudentUpdateToOneWithWhereWithoutTranscriptsInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutTranscriptsInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutTranscriptsInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutTranscriptsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)])
}).strict();
