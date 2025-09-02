import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { BookLoanOrderByWithRelationInputObjectSchema } from './objects/BookLoanOrderByWithRelationInput.schema';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';
import { BookLoanCountAggregateInputObjectSchema } from './objects/BookLoanCountAggregateInput.schema';

export const BookLoanCountSchema: z.ZodType<Prisma.BookLoanCountArgs, z.ZodTypeDef, Prisma.BookLoanCountArgs> = z.object({ orderBy: z.union([BookLoanOrderByWithRelationInputObjectSchema, BookLoanOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookLoanWhereInputObjectSchema.optional(), cursor: BookLoanWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BookLoanCountAggregateInputObjectSchema ]).optional() }).strict();

export const BookLoanCountZodSchema = z.object({ orderBy: z.union([BookLoanOrderByWithRelationInputObjectSchema, BookLoanOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookLoanWhereInputObjectSchema.optional(), cursor: BookLoanWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BookLoanCountAggregateInputObjectSchema ]).optional() }).strict();