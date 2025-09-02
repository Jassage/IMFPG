import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutBookLoansInputObjectSchema } from './StudentCreateWithoutBookLoansInput.schema';
import { StudentUncheckedCreateWithoutBookLoansInputObjectSchema } from './StudentUncheckedCreateWithoutBookLoansInput.schema';
import { StudentCreateOrConnectWithoutBookLoansInputObjectSchema } from './StudentCreateOrConnectWithoutBookLoansInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutBookLoansInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutBookLoansInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutBookLoansInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
