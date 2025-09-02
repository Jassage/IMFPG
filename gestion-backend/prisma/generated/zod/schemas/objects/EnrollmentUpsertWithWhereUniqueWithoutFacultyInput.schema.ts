import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutFacultyInputObjectSchema } from './EnrollmentUpdateWithoutFacultyInput.schema';
import { EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutFacultyInput.schema';
import { EnrollmentCreateWithoutFacultyInputObjectSchema } from './EnrollmentCreateWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateWithoutFacultyInput.schema'

export const EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentUpsertWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentUpsertWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
