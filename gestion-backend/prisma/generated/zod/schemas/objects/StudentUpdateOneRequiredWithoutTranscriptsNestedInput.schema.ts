import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutTranscriptsInputObjectSchema } from './StudentCreateWithoutTranscriptsInput.schema';
import { StudentUncheckedCreateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedCreateWithoutTranscriptsInput.schema';
import { StudentCreateOrConnectWithoutTranscriptsInputObjectSchema } from './StudentCreateOrConnectWithoutTranscriptsInput.schema';
import { StudentUpsertWithoutTranscriptsInputObjectSchema } from './StudentUpsertWithoutTranscriptsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutTranscriptsInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutTranscriptsInput.schema';
import { StudentUpdateWithoutTranscriptsInputObjectSchema } from './StudentUpdateWithoutTranscriptsInput.schema';
import { StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedUpdateWithoutTranscriptsInput.schema'

export const StudentUpdateOneRequiredWithoutTranscriptsNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutTranscriptsNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutTranscriptsNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutTranscriptsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutTranscriptsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutTranscriptsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutTranscriptsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutTranscriptsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUpdateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutTranscriptsInputObjectSchema)]).optional()
}).strict();
