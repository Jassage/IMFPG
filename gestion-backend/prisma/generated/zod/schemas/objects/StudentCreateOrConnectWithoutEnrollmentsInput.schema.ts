import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutEnrollmentsInputObjectSchema } from './StudentCreateWithoutEnrollmentsInput.schema';
import { StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedCreateWithoutEnrollmentsInput.schema'

export const StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
