import { z } from 'zod';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './objects/ProfesseurOrderByWithRelationInput.schema';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';
import { ProfesseurCountAggregateInputObjectSchema } from './objects/ProfesseurCountAggregateInput.schema';
import { ProfesseurMinAggregateInputObjectSchema } from './objects/ProfesseurMinAggregateInput.schema';
import { ProfesseurMaxAggregateInputObjectSchema } from './objects/ProfesseurMaxAggregateInput.schema';

export const ProfesseurAggregateSchema = z.object({ orderBy: z.union([ProfesseurOrderByWithRelationInputObjectSchema, ProfesseurOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProfesseurWhereInputObjectSchema.optional(), cursor: ProfesseurWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ProfesseurCountAggregateInputObjectSchema ]).optional(), _min: ProfesseurMinAggregateInputObjectSchema.optional(), _max: ProfesseurMaxAggregateInputObjectSchema.optional() })