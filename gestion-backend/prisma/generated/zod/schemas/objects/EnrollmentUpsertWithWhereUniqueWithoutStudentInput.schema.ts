import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutStudentInputObjectSchema } from './EnrollmentUpdateWithoutStudentInput.schema';
import { EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutStudentInput.schema';
import { EnrollmentCreateWithoutStudentInputObjectSchema } from './EnrollmentCreateWithoutStudentInput.schema';
import { EnrollmentUncheckedCreateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedCreateWithoutStudentInput.schema'

export const EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
