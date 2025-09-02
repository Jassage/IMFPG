import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptCreateWithoutGradesInputObjectSchema } from './TranscriptCreateWithoutGradesInput.schema';
import { TranscriptUncheckedCreateWithoutGradesInputObjectSchema } from './TranscriptUncheckedCreateWithoutGradesInput.schema';
import { TranscriptCreateOrConnectWithoutGradesInputObjectSchema } from './TranscriptCreateOrConnectWithoutGradesInput.schema';
import { TranscriptUpsertWithoutGradesInputObjectSchema } from './TranscriptUpsertWithoutGradesInput.schema';
import { TranscriptWhereInputObjectSchema } from './TranscriptWhereInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './TranscriptWhereUniqueInput.schema';
import { TranscriptUpdateToOneWithWhereWithoutGradesInputObjectSchema } from './TranscriptUpdateToOneWithWhereWithoutGradesInput.schema';
import { TranscriptUpdateWithoutGradesInputObjectSchema } from './TranscriptUpdateWithoutGradesInput.schema';
import { TranscriptUncheckedUpdateWithoutGradesInputObjectSchema } from './TranscriptUncheckedUpdateWithoutGradesInput.schema'

export const TranscriptUpdateOneWithoutGradesNestedInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateOneWithoutGradesNestedInput, z.ZodTypeDef, Prisma.TranscriptUpdateOneWithoutGradesNestedInput> = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TranscriptCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => TranscriptUpsertWithoutGradesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TranscriptWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TranscriptWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TranscriptWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TranscriptUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
export const TranscriptUpdateOneWithoutGradesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => TranscriptCreateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TranscriptCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => TranscriptUpsertWithoutGradesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TranscriptWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TranscriptWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TranscriptWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TranscriptUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUpdateWithoutGradesInputObjectSchema), z.lazy(() => TranscriptUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
