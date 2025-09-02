import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentCreateWithoutFacultyInputObjectSchema } from './EnrollmentCreateWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateWithoutFacultyInput.schema'

export const EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateOrConnectWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentCreateOrConnectWithoutFacultyInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const EnrollmentCreateOrConnectWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
