import { z } from 'zod';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';
import { AttendanceOrderByWithAggregationInputObjectSchema } from './objects/AttendanceOrderByWithAggregationInput.schema';
import { AttendanceScalarWhereWithAggregatesInputObjectSchema } from './objects/AttendanceScalarWhereWithAggregatesInput.schema';
import { AttendanceScalarFieldEnumSchema } from './enums/AttendanceScalarFieldEnum.schema';
import { AttendanceCountAggregateInputObjectSchema } from './objects/AttendanceCountAggregateInput.schema';
import { AttendanceMinAggregateInputObjectSchema } from './objects/AttendanceMinAggregateInput.schema';
import { AttendanceMaxAggregateInputObjectSchema } from './objects/AttendanceMaxAggregateInput.schema';

export const AttendanceGroupBySchema = z.object({ where: AttendanceWhereInputObjectSchema.optional(), orderBy: z.union([AttendanceOrderByWithAggregationInputObjectSchema, AttendanceOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AttendanceScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AttendanceScalarFieldEnumSchema), _count: z.union([ z.literal(true), AttendanceCountAggregateInputObjectSchema ]).optional(), _min: AttendanceMinAggregateInputObjectSchema.optional(), _max: AttendanceMaxAggregateInputObjectSchema.optional() })