import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutCertificatesInputObjectSchema } from './StudentUpdateWithoutCertificatesInput.schema';
import { StudentUncheckedUpdateWithoutCertificatesInputObjectSchema } from './StudentUncheckedUpdateWithoutCertificatesInput.schema'

export const StudentUpdateToOneWithWhereWithoutCertificatesInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutCertificatesInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutCertificatesInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutCertificatesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)])
}).strict();
