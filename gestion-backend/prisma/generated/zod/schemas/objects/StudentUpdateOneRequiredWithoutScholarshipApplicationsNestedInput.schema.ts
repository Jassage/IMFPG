import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedCreateWithoutScholarshipApplicationsInput.schema';
import { StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateOrConnectWithoutScholarshipApplicationsInput.schema';
import { StudentUpsertWithoutScholarshipApplicationsInputObjectSchema } from './StudentUpsertWithoutScholarshipApplicationsInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInput.schema';
import { StudentUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUpdateWithoutScholarshipApplicationsInput.schema';
import { StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema } from './StudentUncheckedUpdateWithoutScholarshipApplicationsInput.schema'

export const StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutScholarshipApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutScholarshipApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutScholarshipApplicationsInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutScholarshipApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUpdateWithoutScholarshipApplicationsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutScholarshipApplicationsInputObjectSchema)]).optional()
}).strict();
