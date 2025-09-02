import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutUserInputObjectSchema } from './StudentUpdateWithoutUserInput.schema';
import { StudentUncheckedUpdateWithoutUserInputObjectSchema } from './StudentUncheckedUpdateWithoutUserInput.schema';
import { StudentCreateWithoutUserInputObjectSchema } from './StudentCreateWithoutUserInput.schema';
import { StudentUncheckedCreateWithoutUserInputObjectSchema } from './StudentUncheckedCreateWithoutUserInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutUserInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutUserInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutUserInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutUserInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
