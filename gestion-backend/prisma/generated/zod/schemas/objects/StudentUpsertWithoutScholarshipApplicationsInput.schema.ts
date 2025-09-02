import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUpdateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedUpdateWithoutScholarshipApplicationsInput.schema';
import { StudentCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedCreateWithoutScholarshipApplicationsInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutScholarshipApplicationsInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutScholarshipApplicationsInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutScholarshipApplicationsInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutScholarshipApplicationsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
