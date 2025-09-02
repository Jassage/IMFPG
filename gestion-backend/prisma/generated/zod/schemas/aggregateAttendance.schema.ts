import { z } from 'zod';
import { AttendanceOrderByWithRelationInputObjectSchema } from './objects/AttendanceOrderByWithRelationInput.schema';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';
import { AttendanceCountAggregateInputObjectSchema } from './objects/AttendanceCountAggregateInput.schema';
import { AttendanceMinAggregateInputObjectSchema } from './objects/AttendanceMinAggregateInput.schema';
import { AttendanceMaxAggregateInputObjectSchema } from './objects/AttendanceMaxAggregateInput.schema';

export const AttendanceAggregateSchema = z.object({ orderBy: z.union([AttendanceOrderByWithRelationInputObjectSchema, AttendanceOrderByWithRelationInputObjectSchema.array()]).optional(), where: AttendanceWhereInputObjectSchema.optional(), cursor: AttendanceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AttendanceCountAggregateInputObjectSchema ]).optional(), _min: AttendanceMinAggregateInputObjectSchema.optional(), _max: AttendanceMaxAggregateInputObjectSchema.optional() })