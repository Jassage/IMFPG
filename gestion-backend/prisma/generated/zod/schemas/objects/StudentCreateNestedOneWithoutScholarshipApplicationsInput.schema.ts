import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedCreateWithoutScholarshipApplicationsInput.schema';
import { StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateOrConnectWithoutScholarshipApplicationsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutScholarshipApplicationsInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutScholarshipApplicationsInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
