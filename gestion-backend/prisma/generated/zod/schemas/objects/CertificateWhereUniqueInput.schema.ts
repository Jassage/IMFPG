import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateWhereUniqueInputObjectSchema: z.ZodType<Prisma.CertificateWhereUniqueInput, z.ZodTypeDef, Prisma.CertificateWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const CertificateWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
