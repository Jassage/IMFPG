import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutBookLoansInputObjectSchema } from './StudentUpdateWithoutBookLoansInput.schema';
import { StudentUncheckedUpdateWithoutBookLoansInputObjectSchema } from './StudentUncheckedUpdateWithoutBookLoansInput.schema';
import { StudentCreateWithoutBookLoansInputObjectSchema } from './StudentCreateWithoutBookLoansInput.schema';
import { StudentUncheckedCreateWithoutBookLoansInputObjectSchema } from './StudentUncheckedCreateWithoutBookLoansInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutBookLoansInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutBookLoansInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutBookLoansInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
