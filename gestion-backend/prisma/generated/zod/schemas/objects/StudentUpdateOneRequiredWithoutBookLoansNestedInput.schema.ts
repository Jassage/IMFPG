import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutBookLoansInputObjectSchema } from './StudentCreateWithoutBookLoansInput.schema';
import { StudentUncheckedCreateWithoutBookLoansInputObjectSchema } from './StudentUncheckedCreateWithoutBookLoansInput.schema';
import { StudentCreateOrConnectWithoutBookLoansInputObjectSchema } from './StudentCreateOrConnectWithoutBookLoansInput.schema';
import { StudentUpsertWithoutBookLoansInputObjectSchema } from './StudentUpsertWithoutBookLoansInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutBookLoansInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutBookLoansInput.schema';
import { StudentUpdateWithoutBookLoansInputObjectSchema } from './StudentUpdateWithoutBookLoansInput.schema';
import { StudentUncheckedUpdateWithoutBookLoansInputObjectSchema } from './StudentUncheckedUpdateWithoutBookLoansInput.schema'

export const StudentUpdateOneRequiredWithoutBookLoansNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutBookLoansNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutBookLoansNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutBookLoansNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutBookLoansInputObjectSchema)]).optional()
}).strict();
