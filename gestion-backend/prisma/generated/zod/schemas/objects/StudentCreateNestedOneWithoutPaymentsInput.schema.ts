import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutPaymentsInputObjectSchema } from './StudentCreateWithoutPaymentsInput.schema';
import { StudentUncheckedCreateWithoutPaymentsInputObjectSchema } from './StudentUncheckedCreateWithoutPaymentsInput.schema';
import { StudentCreateOrConnectWithoutPaymentsInputObjectSchema } from './StudentCreateOrConnectWithoutPaymentsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutPaymentsInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutPaymentsInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutPaymentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
