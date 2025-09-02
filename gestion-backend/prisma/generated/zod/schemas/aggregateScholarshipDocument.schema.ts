import { z } from 'zod';
import { ScholarshipDocumentOrderByWithRelationInputObjectSchema } from './objects/ScholarshipDocumentOrderByWithRelationInput.schema';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentCountAggregateInputObjectSchema } from './objects/ScholarshipDocumentCountAggregateInput.schema';
import { ScholarshipDocumentMinAggregateInputObjectSchema } from './objects/ScholarshipDocumentMinAggregateInput.schema';
import { ScholarshipDocumentMaxAggregateInputObjectSchema } from './objects/ScholarshipDocumentMaxAggregateInput.schema';

export const ScholarshipDocumentAggregateSchema = z.object({ orderBy: z.union([ScholarshipDocumentOrderByWithRelationInputObjectSchema, ScholarshipDocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipDocumentWhereInputObjectSchema.optional(), cursor: ScholarshipDocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ScholarshipDocumentCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipDocumentMinAggregateInputObjectSchema.optional(), _max: ScholarshipDocumentMaxAggregateInputObjectSchema.optional() })