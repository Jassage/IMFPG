import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutStudentInputObjectSchema } from './EnrollmentUpdateWithoutStudentInput.schema';
import { EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutStudentInput.schema'

export const EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
