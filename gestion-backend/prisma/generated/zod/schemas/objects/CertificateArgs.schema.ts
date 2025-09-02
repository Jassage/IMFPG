import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateSelectObjectSchema } from './CertificateSelect.schema';
import { CertificateIncludeObjectSchema } from './CertificateInclude.schema'

export const CertificateArgsObjectSchema = z.object({
  select: z.lazy(() => CertificateSelectObjectSchema).optional(),
  include: z.lazy(() => CertificateIncludeObjectSchema).optional()
}).strict();
export const CertificateArgsObjectZodSchema = z.object({
  select: z.lazy(() => CertificateSelectObjectSchema).optional(),
  include: z.lazy(() => CertificateIncludeObjectSchema).optional()
}).strict();
