import { z } from 'zod';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';
import { BookOrderByWithAggregationInputObjectSchema } from './objects/BookOrderByWithAggregationInput.schema';
import { BookScalarWhereWithAggregatesInputObjectSchema } from './objects/BookScalarWhereWithAggregatesInput.schema';
import { BookScalarFieldEnumSchema } from './enums/BookScalarFieldEnum.schema';
import { BookCountAggregateInputObjectSchema } from './objects/BookCountAggregateInput.schema';
import { BookMinAggregateInputObjectSchema } from './objects/BookMinAggregateInput.schema';
import { BookMaxAggregateInputObjectSchema } from './objects/BookMaxAggregateInput.schema';

export const BookGroupBySchema = z.object({ where: BookWhereInputObjectSchema.optional(), orderBy: z.union([BookOrderByWithAggregationInputObjectSchema, BookOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BookScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BookScalarFieldEnumSchema), _count: z.union([ z.literal(true), BookCountAggregateInputObjectSchema ]).optional(), _min: BookMinAggregateInputObjectSchema.optional(), _max: BookMaxAggregateInputObjectSchema.optional() })