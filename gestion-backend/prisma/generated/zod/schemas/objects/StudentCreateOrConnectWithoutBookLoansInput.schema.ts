import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutBookLoansInputObjectSchema } from './StudentCreateWithoutBookLoansInput.schema';
import { StudentUncheckedCreateWithoutBookLoansInputObjectSchema } from './StudentUncheckedCreateWithoutBookLoansInput.schema'

export const StudentCreateOrConnectWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutBookLoansInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutBookLoansInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutBookLoansInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)])
}).strict();
