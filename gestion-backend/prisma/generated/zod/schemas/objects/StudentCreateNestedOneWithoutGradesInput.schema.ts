import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutGradesInputObjectSchema } from './StudentCreateWithoutGradesInput.schema';
import { StudentUncheckedCreateWithoutGradesInputObjectSchema } from './StudentUncheckedCreateWithoutGradesInput.schema';
import { StudentCreateOrConnectWithoutGradesInputObjectSchema } from './StudentCreateOrConnectWithoutGradesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutGradesInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutGradesInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutGradesInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutGradesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
