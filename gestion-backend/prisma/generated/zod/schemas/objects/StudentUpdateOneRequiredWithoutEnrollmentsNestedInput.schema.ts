import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutEnrollmentsInputObjectSchema } from './StudentCreateWithoutEnrollmentsInput.schema';
import { StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedCreateWithoutEnrollmentsInput.schema';
import { StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './StudentCreateOrConnectWithoutEnrollmentsInput.schema';
import { StudentUpsertWithoutEnrollmentsInputObjectSchema } from './StudentUpsertWithoutEnrollmentsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutEnrollmentsInput.schema';
import { StudentUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUpdateWithoutEnrollmentsInput.schema';
import { StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedUpdateWithoutEnrollmentsInput.schema'

export const StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutEnrollmentsNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutEnrollmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
