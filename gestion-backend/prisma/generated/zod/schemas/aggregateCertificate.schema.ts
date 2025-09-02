import { z } from 'zod';
import { CertificateOrderByWithRelationInputObjectSchema } from './objects/CertificateOrderByWithRelationInput.schema';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';
import { CertificateCountAggregateInputObjectSchema } from './objects/CertificateCountAggregateInput.schema';
import { CertificateMinAggregateInputObjectSchema } from './objects/CertificateMinAggregateInput.schema';
import { CertificateMaxAggregateInputObjectSchema } from './objects/CertificateMaxAggregateInput.schema';

export const CertificateAggregateSchema = z.object({ orderBy: z.union([CertificateOrderByWithRelationInputObjectSchema, CertificateOrderByWithRelationInputObjectSchema.array()]).optional(), where: CertificateWhereInputObjectSchema.optional(), cursor: CertificateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CertificateCountAggregateInputObjectSchema ]).optional(), _min: CertificateMinAggregateInputObjectSchema.optional(), _max: CertificateMaxAggregateInputObjectSchema.optional() })