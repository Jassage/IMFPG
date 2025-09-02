import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutCertificatesInputObjectSchema } from './StudentCreateWithoutCertificatesInput.schema';
import { StudentUncheckedCreateWithoutCertificatesInputObjectSchema } from './StudentUncheckedCreateWithoutCertificatesInput.schema'

export const StudentCreateOrConnectWithoutCertificatesInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutCertificatesInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutCertificatesInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutCertificatesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)])
}).strict();
