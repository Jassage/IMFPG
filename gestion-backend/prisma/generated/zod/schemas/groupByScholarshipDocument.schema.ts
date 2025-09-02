import { z } from 'zod';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';
import { ScholarshipDocumentOrderByWithAggregationInputObjectSchema } from './objects/ScholarshipDocumentOrderByWithAggregationInput.schema';
import { ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema } from './objects/ScholarshipDocumentScalarWhereWithAggregatesInput.schema';
import { ScholarshipDocumentScalarFieldEnumSchema } from './enums/ScholarshipDocumentScalarFieldEnum.schema';
import { ScholarshipDocumentCountAggregateInputObjectSchema } from './objects/ScholarshipDocumentCountAggregateInput.schema';
import { ScholarshipDocumentMinAggregateInputObjectSchema } from './objects/ScholarshipDocumentMinAggregateInput.schema';
import { ScholarshipDocumentMaxAggregateInputObjectSchema } from './objects/ScholarshipDocumentMaxAggregateInput.schema';

export const ScholarshipDocumentGroupBySchema = z.object({ where: ScholarshipDocumentWhereInputObjectSchema.optional(), orderBy: z.union([ScholarshipDocumentOrderByWithAggregationInputObjectSchema, ScholarshipDocumentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ScholarshipDocumentScalarFieldEnumSchema), _count: z.union([ z.literal(true), ScholarshipDocumentCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipDocumentMinAggregateInputObjectSchema.optional(), _max: ScholarshipDocumentMaxAggregateInputObjectSchema.optional() })