import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { BookOrderByWithRelationInputObjectSchema } from './objects/BookOrderByWithRelationInput.schema';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';
import { BookCountAggregateInputObjectSchema } from './objects/BookCountAggregateInput.schema';

export const BookCountSchema: z.ZodType<Prisma.BookCountArgs, z.ZodTypeDef, Prisma.BookCountArgs> = z.object({ orderBy: z.union([BookOrderByWithRelationInputObjectSchema, BookOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookWhereInputObjectSchema.optional(), cursor: BookWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BookCountAggregateInputObjectSchema ]).optional() }).strict();

export const BookCountZodSchema = z.object({ orderBy: z.union([BookOrderByWithRelationInputObjectSchema, BookOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookWhereInputObjectSchema.optional(), cursor: BookWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BookCountAggregateInputObjectSchema ]).optional() }).strict();