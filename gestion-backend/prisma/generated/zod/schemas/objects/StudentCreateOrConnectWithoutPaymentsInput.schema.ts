import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutPaymentsInputObjectSchema } from './StudentCreateWithoutPaymentsInput.schema';
import { StudentUncheckedCreateWithoutPaymentsInputObjectSchema } from './StudentUncheckedCreateWithoutPaymentsInput.schema'

export const StudentCreateOrConnectWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutPaymentsInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutPaymentsInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutPaymentsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
