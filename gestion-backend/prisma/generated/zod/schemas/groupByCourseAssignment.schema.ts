import { z } from 'zod';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';
import { CourseAssignmentOrderByWithAggregationInputObjectSchema } from './objects/CourseAssignmentOrderByWithAggregationInput.schema';
import { CourseAssignmentScalarWhereWithAggregatesInputObjectSchema } from './objects/CourseAssignmentScalarWhereWithAggregatesInput.schema';
import { CourseAssignmentScalarFieldEnumSchema } from './enums/CourseAssignmentScalarFieldEnum.schema';
import { CourseAssignmentCountAggregateInputObjectSchema } from './objects/CourseAssignmentCountAggregateInput.schema';
import { CourseAssignmentMinAggregateInputObjectSchema } from './objects/CourseAssignmentMinAggregateInput.schema';
import { CourseAssignmentMaxAggregateInputObjectSchema } from './objects/CourseAssignmentMaxAggregateInput.schema';

export const CourseAssignmentGroupBySchema = z.object({ where: CourseAssignmentWhereInputObjectSchema.optional(), orderBy: z.union([CourseAssignmentOrderByWithAggregationInputObjectSchema, CourseAssignmentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CourseAssignmentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CourseAssignmentScalarFieldEnumSchema), _count: z.union([ z.literal(true), CourseAssignmentCountAggregateInputObjectSchema ]).optional(), _min: CourseAssignmentMinAggregateInputObjectSchema.optional(), _max: CourseAssignmentMaxAggregateInputObjectSchema.optional() })