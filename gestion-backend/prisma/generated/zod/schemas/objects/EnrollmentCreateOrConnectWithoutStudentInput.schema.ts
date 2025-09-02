import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentCreateWithoutStudentInputObjectSchema } from './EnrollmentCreateWithoutStudentInput.schema';
import { EnrollmentUncheckedCreateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedCreateWithoutStudentInput.schema'

export const EnrollmentCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const EnrollmentCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
