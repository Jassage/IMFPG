import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutTranscriptsInputObjectSchema } from './StudentCreateWithoutTranscriptsInput.schema';
import { StudentUncheckedCreateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedCreateWithoutTranscriptsInput.schema'

export const StudentCreateOrConnectWithoutTranscriptsInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutTranscriptsInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutTranscriptsInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutTranscriptsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)])
}).strict();
