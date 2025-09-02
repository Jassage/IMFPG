import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutPaymentsInputObjectSchema } from './StudentCreateWithoutPaymentsInput.schema';
import { StudentUncheckedCreateWithoutPaymentsInputObjectSchema } from './StudentUncheckedCreateWithoutPaymentsInput.schema';
import { StudentCreateOrConnectWithoutPaymentsInputObjectSchema } from './StudentCreateOrConnectWithoutPaymentsInput.schema';
import { StudentUpsertWithoutPaymentsInputObjectSchema } from './StudentUpsertWithoutPaymentsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutPaymentsInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutPaymentsInput.schema';
import { StudentUpdateWithoutPaymentsInputObjectSchema } from './StudentUpdateWithoutPaymentsInput.schema';
import { StudentUncheckedUpdateWithoutPaymentsInputObjectSchema } from './StudentUncheckedUpdateWithoutPaymentsInput.schema'

export const StudentUpdateOneRequiredWithoutPaymentsNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutPaymentsNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutPaymentsNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutPaymentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
