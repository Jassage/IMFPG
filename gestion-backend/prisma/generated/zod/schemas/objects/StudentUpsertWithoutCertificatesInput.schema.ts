import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutCertificatesInputObjectSchema } from './StudentUpdateWithoutCertificatesInput.schema';
import { StudentUncheckedUpdateWithoutCertificatesInputObjectSchema } from './StudentUncheckedUpdateWithoutCertificatesInput.schema';
import { StudentCreateWithoutCertificatesInputObjectSchema } from './StudentCreateWithoutCertificatesInput.schema';
import { StudentUncheckedCreateWithoutCertificatesInputObjectSchema } from './StudentUncheckedCreateWithoutCertificatesInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutCertificatesInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutCertificatesInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutCertificatesInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutCertificatesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
