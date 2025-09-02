import { z } from 'zod';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';
import { CertificateOrderByWithAggregationInputObjectSchema } from './objects/CertificateOrderByWithAggregationInput.schema';
import { CertificateScalarWhereWithAggregatesInputObjectSchema } from './objects/CertificateScalarWhereWithAggregatesInput.schema';
import { CertificateScalarFieldEnumSchema } from './enums/CertificateScalarFieldEnum.schema';
import { CertificateCountAggregateInputObjectSchema } from './objects/CertificateCountAggregateInput.schema';
import { CertificateMinAggregateInputObjectSchema } from './objects/CertificateMinAggregateInput.schema';
import { CertificateMaxAggregateInputObjectSchema } from './objects/CertificateMaxAggregateInput.schema';

export const CertificateGroupBySchema = z.object({ where: CertificateWhereInputObjectSchema.optional(), orderBy: z.union([CertificateOrderByWithAggregationInputObjectSchema, CertificateOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CertificateScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CertificateScalarFieldEnumSchema), _count: z.union([ z.literal(true), CertificateCountAggregateInputObjectSchema ]).optional(), _min: CertificateMinAggregateInputObjectSchema.optional(), _max: CertificateMaxAggregateInputObjectSchema.optional() })