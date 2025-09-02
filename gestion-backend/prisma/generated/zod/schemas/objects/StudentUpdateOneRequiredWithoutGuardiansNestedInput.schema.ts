import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutGuardiansInputObjectSchema } from './StudentCreateWithoutGuardiansInput.schema';
import { StudentUncheckedCreateWithoutGuardiansInputObjectSchema } from './StudentUncheckedCreateWithoutGuardiansInput.schema';
import { StudentCreateOrConnectWithoutGuardiansInputObjectSchema } from './StudentCreateOrConnectWithoutGuardiansInput.schema';
import { StudentUpsertWithoutGuardiansInputObjectSchema } from './StudentUpsertWithoutGuardiansInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutGuardiansInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutGuardiansInput.schema';
import { StudentUpdateWithoutGuardiansInputObjectSchema } from './StudentUpdateWithoutGuardiansInput.schema';
import { StudentUncheckedUpdateWithoutGuardiansInputObjectSchema } from './StudentUncheckedUpdateWithoutGuardiansInput.schema'

export const StudentUpdateOneRequiredWithoutGuardiansNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutGuardiansNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutGuardiansNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGuardiansInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutGuardiansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutGuardiansNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGuardiansInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutGuardiansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)]).optional()
}).strict();
