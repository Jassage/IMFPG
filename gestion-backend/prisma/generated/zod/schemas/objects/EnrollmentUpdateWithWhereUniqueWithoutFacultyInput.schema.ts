import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutFacultyInputObjectSchema } from './EnrollmentUpdateWithoutFacultyInput.schema';
import { EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutFacultyInput.schema'

export const EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentUpdateWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
export const EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
