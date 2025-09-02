import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedCreateWithoutScholarshipApplicationsInput.schema'

export const StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutScholarshipApplicationsInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutScholarshipApplicationsInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)])
}).strict();
