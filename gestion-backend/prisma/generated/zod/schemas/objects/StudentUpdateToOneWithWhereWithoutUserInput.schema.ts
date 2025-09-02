import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutUserInputObjectSchema } from './StudentUpdateWithoutUserInput.schema';
import { StudentUncheckedUpdateWithoutUserInputObjectSchema } from './StudentUncheckedUpdateWithoutUserInput.schema'

export const StudentUpdateToOneWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutUserInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutUserInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
