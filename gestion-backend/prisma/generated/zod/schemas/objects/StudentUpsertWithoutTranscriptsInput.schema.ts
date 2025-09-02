import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutTranscriptsInputObjectSchema } from './StudentUpdateWithoutTranscriptsInput.schema';
import { StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedUpdateWithoutTranscriptsInput.schema';
import { StudentCreateWithoutTranscriptsInputObjectSchema } from './StudentCreateWithoutTranscriptsInput.schema';
import { StudentUncheckedCreateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedCreateWithoutTranscriptsInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutTranscriptsInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutTranscriptsInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutTranscriptsInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutTranscriptsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
