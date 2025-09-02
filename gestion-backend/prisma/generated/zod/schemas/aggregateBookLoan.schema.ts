import { z } from 'zod';
import { BookLoanOrderByWithRelationInputObjectSchema } from './objects/BookLoanOrderByWithRelationInput.schema';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';
import { BookLoanCountAggregateInputObjectSchema } from './objects/BookLoanCountAggregateInput.schema';
import { BookLoanMinAggregateInputObjectSchema } from './objects/BookLoanMinAggregateInput.schema';
import { BookLoanMaxAggregateInputObjectSchema } from './objects/BookLoanMaxAggregateInput.schema';
import { BookLoanAvgAggregateInputObjectSchema } from './objects/BookLoanAvgAggregateInput.schema';
import { BookLoanSumAggregateInputObjectSchema } from './objects/BookLoanSumAggregateInput.schema';

export const BookLoanAggregateSchema = z.object({ orderBy: z.union([BookLoanOrderByWithRelationInputObjectSchema, BookLoanOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookLoanWhereInputObjectSchema.optional(), cursor: BookLoanWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BookLoanCountAggregateInputObjectSchema ]).optional(), _min: BookLoanMinAggregateInputObjectSchema.optional(), _max: BookLoanMaxAggregateInputObjectSchema.optional(), _avg: BookLoanAvgAggregateInputObjectSchema.optional(), _sum: BookLoanSumAggregateInputObjectSchema.optional() })