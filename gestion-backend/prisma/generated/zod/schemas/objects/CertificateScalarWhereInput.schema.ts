import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const CertificateScalarWhereInputObjectSchema: z.ZodType<Prisma.CertificateScalarWhereInput, z.ZodTypeDef, Prisma.CertificateScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CertificateScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  issueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  validUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  signedBy: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  verificationCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const CertificateScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CertificateScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  issueDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  validUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  signedBy: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  verificationCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
