import { z } from 'zod';
import { CourseAssignmentOrderByWithRelationInputObjectSchema } from './objects/CourseAssignmentOrderByWithRelationInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCountAggregateInputObjectSchema } from './objects/CourseAssignmentCountAggregateInput.schema';
import { CourseAssignmentMinAggregateInputObjectSchema } from './objects/CourseAssignmentMinAggregateInput.schema';
import { CourseAssignmentMaxAggregateInputObjectSchema } from './objects/CourseAssignmentMaxAggregateInput.schema';

export const CourseAssignmentAggregateSchema = z.object({ orderBy: z.union([CourseAssignmentOrderByWithRelationInputObjectSchema, CourseAssignmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseAssignmentWhereInputObjectSchema.optional(), cursor: CourseAssignmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CourseAssignmentCountAggregateInputObjectSchema ]).optional(), _min: CourseAssignmentMinAggregateInputObjectSchema.optional(), _max: CourseAssignmentMaxAggregateInputObjectSchema.optional() })