import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutCertificatesInputObjectSchema } from './StudentCreateWithoutCertificatesInput.schema';
import { StudentUncheckedCreateWithoutCertificatesInputObjectSchema } from './StudentUncheckedCreateWithoutCertificatesInput.schema';
import { StudentCreateOrConnectWithoutCertificatesInputObjectSchema } from './StudentCreateOrConnectWithoutCertificatesInput.schema';
import { StudentUpsertWithoutCertificatesInputObjectSchema } from './StudentUpsertWithoutCertificatesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutCertificatesInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutCertificatesInput.schema';
import { StudentUpdateWithoutCertificatesInputObjectSchema } from './StudentUpdateWithoutCertificatesInput.schema';
import { StudentUncheckedUpdateWithoutCertificatesInputObjectSchema } from './StudentUncheckedUpdateWithoutCertificatesInput.schema'

export const StudentUpdateOneRequiredWithoutCertificatesNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutCertificatesNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutCertificatesNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutCertificatesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutCertificatesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutCertificatesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutCertificatesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutCertificatesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUpdateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutCertificatesInputObjectSchema)]).optional()
}).strict();
