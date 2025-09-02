import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutBookLoansInputObjectSchema } from './StudentUpdateWithoutBookLoansInput.schema';
import { StudentUncheckedUpdateWithoutBookLoansInputObjectSchema } from './StudentUncheckedUpdateWithoutBookLoansInput.schema'

export const StudentUpdateToOneWithWhereWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutBookLoansInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutBookLoansInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutBookLoansInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)])
}).strict();
