import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { CertificateIncludeObjectSchema } from './objects/CertificateInclude.schema';
import { CertificateOrderByWithRelationInputObjectSchema } from './objects/CertificateOrderByWithRelationInput.schema';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';
import { CertificateScalarFieldEnumSchema } from './enums/CertificateScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CertificateFindManySelectSchema: z.ZodType<Prisma.CertificateSelect, z.ZodTypeDef, Prisma.CertificateSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    type: z.boolean().optional(),
    title: z.boolean().optional(),
    issueDate: z.boolean().optional(),
    validUntil: z.boolean().optional(),
    signedBy: z.boolean().optional(),
    verificationCode: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const CertificateFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    type: z.boolean().optional(),
    title: z.boolean().optional(),
    issueDate: z.boolean().optional(),
    validUntil: z.boolean().optional(),
    signedBy: z.boolean().optional(),
    verificationCode: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const CertificateFindManySchema: z.ZodType<Prisma.CertificateFindManyArgs, z.ZodTypeDef, Prisma.CertificateFindManyArgs> = z.object({ select: CertificateFindManySelectSchema.optional(), include: z.lazy(() => CertificateIncludeObjectSchema.optional()), orderBy: z.union([CertificateOrderByWithRelationInputObjectSchema, CertificateOrderByWithRelationInputObjectSchema.array()]).optional(), where: CertificateWhereInputObjectSchema.optional(), cursor: CertificateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CertificateScalarFieldEnumSchema, CertificateScalarFieldEnumSchema.array()]).optional() }).strict();

export const CertificateFindManyZodSchema = z.object({ select: CertificateFindManySelectSchema.optional(), include: z.lazy(() => CertificateIncludeObjectSchema.optional()), orderBy: z.union([CertificateOrderByWithRelationInputObjectSchema, CertificateOrderByWithRelationInputObjectSchema.array()]).optional(), where: CertificateWhereInputObjectSchema.optional(), cursor: CertificateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CertificateScalarFieldEnumSchema, CertificateScalarFieldEnumSchema.array()]).optional() }).strict();