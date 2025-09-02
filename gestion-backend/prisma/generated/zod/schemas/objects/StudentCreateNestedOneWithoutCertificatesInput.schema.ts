import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutCertificatesInputObjectSchema } from './StudentCreateWithoutCertificatesInput.schema';
import { StudentUncheckedCreateWithoutCertificatesInputObjectSchema } from './StudentUncheckedCreateWithoutCertificatesInput.schema';
import { StudentCreateOrConnectWithoutCertificatesInputObjectSchema } from './StudentCreateOrConnectWithoutCertificatesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutCertificatesInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutCertificatesInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutCertificatesInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutCertificatesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutCertificatesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutCertificatesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutCertificatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutCertificatesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
