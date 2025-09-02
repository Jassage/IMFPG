import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutGradesInputObjectSchema } from './StudentCreateWithoutGradesInput.schema';
import { StudentUncheckedCreateWithoutGradesInputObjectSchema } from './StudentUncheckedCreateWithoutGradesInput.schema';
import { StudentCreateOrConnectWithoutGradesInputObjectSchema } from './StudentCreateOrConnectWithoutGradesInput.schema';
import { StudentUpsertWithoutGradesInputObjectSchema } from './StudentUpsertWithoutGradesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutGradesInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutGradesInput.schema';
import { StudentUpdateWithoutGradesInputObjectSchema } from './StudentUpdateWithoutGradesInput.schema';
import { StudentUncheckedUpdateWithoutGradesInputObjectSchema } from './StudentUncheckedUpdateWithoutGradesInput.schema'

export const StudentUpdateOneRequiredWithoutGradesNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutGradesNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutGradesNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutGradesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
