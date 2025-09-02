import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutEnrollmentsInputObjectSchema } from './StudentCreateWithoutEnrollmentsInput.schema';
import { StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedCreateWithoutEnrollmentsInput.schema';
import { StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './StudentCreateOrConnectWithoutEnrollmentsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutEnrollmentsInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutEnrollmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
