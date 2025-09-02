import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUpdateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedUpdateWithoutScholarshipApplicationsInput.schema'

export const StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)])
}).strict();
