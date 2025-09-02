import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { BookIncludeObjectSchema } from './objects/BookInclude.schema';
import { BookOrderByWithRelationInputObjectSchema } from './objects/BookOrderByWithRelationInput.schema';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';
import { BookScalarFieldEnumSchema } from './enums/BookScalarFieldEnum.schema';
import { BookLoanArgsObjectSchema } from './objects/BookLoanArgs.schema';
import { BookCountOutputTypeArgsObjectSchema } from './objects/BookCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BookFindManySelectSchema: z.ZodType<Prisma.BookSelect, z.ZodTypeDef, Prisma.BookSelect> = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    author: z.boolean().optional(),
    isbn: z.boolean().optional(),
    category: z.boolean().optional(),
    faculty: z.boolean().optional(),
    quantity: z.boolean().optional(),
    available: z.boolean().optional(),
    location: z.boolean().optional(),
    status: z.boolean().optional(),
    bookLoans: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BookFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    author: z.boolean().optional(),
    isbn: z.boolean().optional(),
    category: z.boolean().optional(),
    faculty: z.boolean().optional(),
    quantity: z.boolean().optional(),
    available: z.boolean().optional(),
    location: z.boolean().optional(),
    status: z.boolean().optional(),
    bookLoans: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BookFindManySchema: z.ZodType<Prisma.BookFindManyArgs, z.ZodTypeDef, Prisma.BookFindManyArgs> = z.object({ select: BookFindManySelectSchema.optional(), include: z.lazy(() => BookIncludeObjectSchema.optional()), orderBy: z.union([BookOrderByWithRelationInputObjectSchema, BookOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookWhereInputObjectSchema.optional(), cursor: BookWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BookScalarFieldEnumSchema, BookScalarFieldEnumSchema.array()]).optional() }).strict();

export const BookFindManyZodSchema = z.object({ select: BookFindManySelectSchema.optional(), include: z.lazy(() => BookIncludeObjectSchema.optional()), orderBy: z.union([BookOrderByWithRelationInputObjectSchema, BookOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookWhereInputObjectSchema.optional(), cursor: BookWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BookScalarFieldEnumSchema, BookScalarFieldEnumSchema.array()]).optional() }).strict();