import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutGradesInputObjectSchema } from './StudentCreateWithoutGradesInput.schema';
import { StudentUncheckedCreateWithoutGradesInputObjectSchema } from './StudentUncheckedCreateWithoutGradesInput.schema'

export const StudentCreateOrConnectWithoutGradesInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutGradesInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutGradesInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
