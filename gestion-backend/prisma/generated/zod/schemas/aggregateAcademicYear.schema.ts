import { z } from 'zod';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './objects/AcademicYearOrderByWithRelationInput.schema';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';
import { AcademicYearCountAggregateInputObjectSchema } from './objects/AcademicYearCountAggregateInput.schema';
import { AcademicYearMinAggregateInputObjectSchema } from './objects/AcademicYearMinAggregateInput.schema';
import { AcademicYearMaxAggregateInputObjectSchema } from './objects/AcademicYearMaxAggregateInput.schema';

export const AcademicYearAggregateSchema = z.object({ orderBy: z.union([AcademicYearOrderByWithRelationInputObjectSchema, AcademicYearOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcademicYearWhereInputObjectSchema.optional(), cursor: AcademicYearWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AcademicYearCountAggregateInputObjectSchema ]).optional(), _min: AcademicYearMinAggregateInputObjectSchema.optional(), _max: AcademicYearMaxAggregateInputObjectSchema.optional() })