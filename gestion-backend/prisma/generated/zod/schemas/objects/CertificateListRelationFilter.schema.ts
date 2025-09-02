import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateWhereInputObjectSchema } from './CertificateWhereInput.schema'

export const CertificateListRelationFilterObjectSchema: z.ZodType<Prisma.CertificateListRelationFilter, z.ZodTypeDef, Prisma.CertificateListRelationFilter> = z.object({
  every: z.lazy(() => CertificateWhereInputObjectSchema).optional(),
  some: z.lazy(() => CertificateWhereInputObjectSchema).optional(),
  none: z.lazy(() => CertificateWhereInputObjectSchema).optional()
}).strict();
export const CertificateListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => CertificateWhereInputObjectSchema).optional(),
  some: z.lazy(() => CertificateWhereInputObjectSchema).optional(),
  none: z.lazy(() => CertificateWhereInputObjectSchema).optional()
}).strict();
