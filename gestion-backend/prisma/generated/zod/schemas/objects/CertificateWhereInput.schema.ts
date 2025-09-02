import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const CertificateWhereInputObjectSchema: z.ZodType<Prisma.CertificateWhereInput, z.ZodTypeDef, Prisma.CertificateWhereInput> = z.object({
  AND: z.union([z.lazy(() => CertificateWhereInputObjectSchema), z.lazy(() => CertificateWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CertificateWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CertificateWhereInputObjectSchema), z.lazy(() => CertificateWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  issueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  validUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  signedBy: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  verificationCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
export const CertificateWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => CertificateWhereInputObjectSchema), z.lazy(() => CertificateWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CertificateWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CertificateWhereInputObjectSchema), z.lazy(() => CertificateWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  issueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  validUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  signedBy: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  verificationCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
