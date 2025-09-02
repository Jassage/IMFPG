import { z } from 'zod';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';
import { AcademicYearOrderByWithAggregationInputObjectSchema } from './objects/AcademicYearOrderByWithAggregationInput.schema';
import { AcademicYearScalarWhereWithAggregatesInputObjectSchema } from './objects/AcademicYearScalarWhereWithAggregatesInput.schema';
import { AcademicYearScalarFieldEnumSchema } from './enums/AcademicYearScalarFieldEnum.schema';
import { AcademicYearCountAggregateInputObjectSchema } from './objects/AcademicYearCountAggregateInput.schema';
import { AcademicYearMinAggregateInputObjectSchema } from './objects/AcademicYearMinAggregateInput.schema';
import { AcademicYearMaxAggregateInputObjectSchema } from './objects/AcademicYearMaxAggregateInput.schema';

export const AcademicYearGroupBySchema = z.object({ where: AcademicYearWhereInputObjectSchema.optional(), orderBy: z.union([AcademicYearOrderByWithAggregationInputObjectSchema, AcademicYearOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AcademicYearScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AcademicYearScalarFieldEnumSchema), _count: z.union([ z.literal(true), AcademicYearCountAggregateInputObjectSchema ]).optional(), _min: AcademicYearMinAggregateInputObjectSchema.optional(), _max: AcademicYearMaxAggregateInputObjectSchema.optional() })