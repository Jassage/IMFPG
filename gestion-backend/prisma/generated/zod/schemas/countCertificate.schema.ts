import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { CertificateOrderByWithRelationInputObjectSchema } from './objects/CertificateOrderByWithRelationInput.schema';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';
import { CertificateCountAggregateInputObjectSchema } from './objects/CertificateCountAggregateInput.schema';

export const CertificateCountSchema: z.ZodType<Prisma.CertificateCountArgs, z.ZodTypeDef, Prisma.CertificateCountArgs> = z.object({ orderBy: z.union([CertificateOrderByWithRelationInputObjectSchema, CertificateOrderByWithRelationInputObjectSchema.array()]).optional(), where: CertificateWhereInputObjectSchema.optional(), cursor: CertificateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CertificateCountAggregateInputObjectSchema ]).optional() }).strict();

export const CertificateCountZodSchema = z.object({ orderBy: z.union([CertificateOrderByWithRelationInputObjectSchema, CertificateOrderByWithRelationInputObjectSchema.array()]).optional(), where: CertificateWhereInputObjectSchema.optional(), cursor: CertificateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CertificateCountAggregateInputObjectSchema ]).optional() }).strict();