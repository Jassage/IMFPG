import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutTranscriptsInputObjectSchema } from './StudentCreateWithoutTranscriptsInput.schema';
import { StudentUncheckedCreateWithoutTranscriptsInputObjectSchema } from './StudentUncheckedCreateWithoutTranscriptsInput.schema';
import { StudentCreateOrConnectWithoutTranscriptsInputObjectSchema } from './StudentCreateOrConnectWithoutTranscriptsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutTranscriptsInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutTranscriptsInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutTranscriptsInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutTranscriptsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutTranscriptsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutTranscriptsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutTranscriptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutTranscriptsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
