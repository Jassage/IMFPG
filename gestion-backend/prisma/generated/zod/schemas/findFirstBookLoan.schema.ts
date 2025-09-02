import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { BookLoanIncludeObjectSchema } from './objects/BookLoanInclude.schema';
import { BookLoanOrderByWithRelationInputObjectSchema } from './objects/BookLoanOrderByWithRelationInput.schema';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';
import { BookLoanScalarFieldEnumSchema } from './enums/BookLoanScalarFieldEnum.schema';
import { BookArgsObjectSchema } from './objects/BookArgs.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BookLoanFindFirstSelectSchema: z.ZodType<Prisma.BookLoanSelect, z.ZodTypeDef, Prisma.BookLoanSelect> = z.object({
    id: z.boolean().optional(),
    book: z.boolean().optional(),
    bookId: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    loanDate: z.boolean().optional(),
    dueDate: z.boolean().optional(),
    returnDate: z.boolean().optional(),
    status: z.boolean().optional(),
    renewalCount: z.boolean().optional(),
    fine: z.boolean().optional()
  }).strict();

export const BookLoanFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    book: z.boolean().optional(),
    bookId: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    loanDate: z.boolean().optional(),
    dueDate: z.boolean().optional(),
    returnDate: z.boolean().optional(),
    status: z.boolean().optional(),
    renewalCount: z.boolean().optional(),
    fine: z.boolean().optional()
  }).strict();

export const BookLoanFindFirstSchema: z.ZodType<Prisma.BookLoanFindFirstArgs, z.ZodTypeDef, Prisma.BookLoanFindFirstArgs> = z.object({ select: BookLoanFindFirstSelectSchema.optional(), include: z.lazy(() => BookLoanIncludeObjectSchema.optional()), orderBy: z.union([BookLoanOrderByWithRelationInputObjectSchema, BookLoanOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookLoanWhereInputObjectSchema.optional(), cursor: BookLoanWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BookLoanScalarFieldEnumSchema, BookLoanScalarFieldEnumSchema.array()]).optional() }).strict();

export const BookLoanFindFirstZodSchema = z.object({ select: BookLoanFindFirstSelectSchema.optional(), include: z.lazy(() => BookLoanIncludeObjectSchema.optional()), orderBy: z.union([BookLoanOrderByWithRelationInputObjectSchema, BookLoanOrderByWithRelationInputObjectSchema.array()]).optional(), where: BookLoanWhereInputObjectSchema.optional(), cursor: BookLoanWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BookLoanScalarFieldEnumSchema, BookLoanScalarFieldEnumSchema.array()]).optional() }).strict();