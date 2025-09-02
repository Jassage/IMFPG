import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema';
import { EnrollmentUpdateManyMutationInputObjectSchema } from './EnrollmentUpdateManyMutationInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutFacultyInput.schema'

export const EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateManyWithWhereWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentUpdateManyWithWhereWithoutFacultyInput> = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
export const EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
