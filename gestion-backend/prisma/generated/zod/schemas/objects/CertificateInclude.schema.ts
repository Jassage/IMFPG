import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema'

export const CertificateIncludeObjectSchema: z.ZodType<Prisma.CertificateInclude, z.ZodTypeDef, Prisma.CertificateInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
export const CertificateIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
