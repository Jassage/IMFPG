import { z } from 'zod';
import { BookOrderByWithRelationInputObjectSchema } from './objects/BookOrderByWithRelationInput.schema';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';
import { BookCountAggregateInputObjectSchema } from './objects/BookCountAggregateInput.schema';
import { BookMinAggregateInputObjectSchema } from './objects/BookMinAggregateInput.schema';
import { BookMaxAggregateInputObjectSchema } from './objects/BookMaxAggregateInput.schema';
import { BookAvgAggregateInputObjectSchema } from './objects/BookAvgAggregateInput.schema';
import { BookSumAggregateInputObjectSchema } from './objects/BookSumAggregateInput.schema';

export const BookAggregateSchema = z.object({ orderBy: z.union([BookOrderByWithRelationInputObjectSchema, BookOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookWhereInputObjectSchema.optional(), cursor: BookWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BookCountAggregateInputObjectSchema ]).optional(), _min: BookMinAggregateInputObjectSchema.optional(), _max: BookMaxAggregateInputObjectSchema.optional(), _avg: BookAvgAggregateInputObjectSchema.optional(), _sum: BookSumAggregateInputObjectSchema.optional() })