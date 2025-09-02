import { z } from 'zod';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';
import { BookLoanOrderByWithAggregationInputObjectSchema } from './objects/BookLoanOrderByWithAggregationInput.schema';
import { BookLoanScalarWhereWithAggregatesInputObjectSchema } from './objects/BookLoanScalarWhereWithAggregatesInput.schema';
import { BookLoanScalarFieldEnumSchema } from './enums/BookLoanScalarFieldEnum.schema';
import { BookLoanCountAggregateInputObjectSchema } from './objects/BookLoanCountAggregateInput.schema';
import { BookLoanMinAggregateInputObjectSchema } from './objects/BookLoanMinAggregateInput.schema';
import { BookLoanMaxAggregateInputObjectSchema } from './objects/BookLoanMaxAggregateInput.schema';

export const BookLoanGroupBySchema = z.object({ where: BookLoanWhereInputObjectSchema.optional(), orderBy: z.union([BookLoanOrderByWithAggregationInputObjectSchema, BookLoanOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BookLoanScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BookLoanScalarFieldEnumSchema), _count: z.union([ z.literal(true), BookLoanCountAggregateInputObjectSchema ]).optional(), _min: BookLoanMinAggregateInputObjectSchema.optional(), _max: BookLoanMaxAggregateInputObjectSchema.optional() })