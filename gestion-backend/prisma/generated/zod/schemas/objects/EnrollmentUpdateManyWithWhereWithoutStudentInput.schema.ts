import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema';
import { EnrollmentUpdateManyMutationInputObjectSchema } from './EnrollmentUpdateManyMutationInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutStudentInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutStudentInput.schema'

export const EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const EnrollmentUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
