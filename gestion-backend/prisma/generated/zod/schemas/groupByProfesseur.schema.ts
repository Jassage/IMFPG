import { z } from 'zod';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';
import { ProfesseurOrderByWithAggregationInputObjectSchema } from './objects/ProfesseurOrderByWithAggregationInput.schema';
import { ProfesseurScalarWhereWithAggregatesInputObjectSchema } from './objects/ProfesseurScalarWhereWithAggregatesInput.schema';
import { ProfesseurScalarFieldEnumSchema } from './enums/ProfesseurScalarFieldEnum.schema';
import { ProfesseurCountAggregateInputObjectSchema } from './objects/ProfesseurCountAggregateInput.schema';
import { ProfesseurMinAggregateInputObjectSchema } from './objects/ProfesseurMinAggregateInput.schema';
import { ProfesseurMaxAggregateInputObjectSchema } from './objects/ProfesseurMaxAggregateInput.schema';

export const ProfesseurGroupBySchema = z.object({ where: ProfesseurWhereInputObjectSchema.optional(), orderBy: z.union([ProfesseurOrderByWithAggregationInputObjectSchema, ProfesseurOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ProfesseurScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ProfesseurScalarFieldEnumSchema), _count: z.union([ z.literal(true), ProfesseurCountAggregateInputObjectSchema ]).optional(), _min: ProfesseurMinAggregateInputObjectSchema.optional(), _max: ProfesseurMaxAggregateInputObjectSchema.optional() })