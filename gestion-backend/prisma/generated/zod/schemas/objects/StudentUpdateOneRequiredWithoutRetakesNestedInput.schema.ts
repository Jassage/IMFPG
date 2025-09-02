import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutRetakesInputObjectSchema } from './StudentCreateWithoutRetakesInput.schema';
import { StudentUncheckedCreateWithoutRetakesInputObjectSchema } from './StudentUncheckedCreateWithoutRetakesInput.schema';
import { StudentCreateOrConnectWithoutRetakesInputObjectSchema } from './StudentCreateOrConnectWithoutRetakesInput.schema';
import { StudentUpsertWithoutRetakesInputObjectSchema } from './StudentUpsertWithoutRetakesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutRetakesInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutRetakesInput.schema';
import { StudentUpdateWithoutRetakesInputObjectSchema } from './StudentUpdateWithoutRetakesInput.schema';
import { StudentUncheckedUpdateWithoutRetakesInputObjectSchema } from './StudentUncheckedUpdateWithoutRetakesInput.schema'

export const StudentUpdateOneRequiredWithoutRetakesNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutRetakesNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutRetakesNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutRetakesInputObjectSchema), z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutRetakesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutRetakesInputObjectSchema), z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)]).optional()
}).strict();
