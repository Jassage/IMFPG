import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { PaymentIncludeObjectSchema } from './objects/PaymentInclude.schema';
import { PaymentOrderByWithRelationInputObjectSchema } from './objects/PaymentOrderByWithRelationInput.schema';
import { PaymentWhereInputObjectSchema } from './objects/PaymentWhereInput.schema';
import { PaymentWhereUniqueInputObjectSchema } from './objects/PaymentWhereUniqueInput.schema';
import { PaymentScalarFieldEnumSchema } from './enums/PaymentScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { AcademicYearArgsObjectSchema } from './objects/AcademicYearArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PaymentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.PaymentSelect, z.ZodTypeDef, Prisma.PaymentSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    amount: z.boolean().optional(),
    type: z.boolean().optional(),
    moyen: z.boolean().optional(),
    status: z.boolean().optional(),
    paidDate: z.boolean().optional(),
    description: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const PaymentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    amount: z.boolean().optional(),
    type: z.boolean().optional(),
    moyen: z.boolean().optional(),
    status: z.boolean().optional(),
    paidDate: z.boolean().optional(),
    description: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const PaymentFindFirstOrThrowSchema: z.ZodType<Prisma.PaymentFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.PaymentFindFirstOrThrowArgs> = z.object({ select: PaymentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => PaymentIncludeObjectSchema.optional()), orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array()]).optional() }).strict();

export const PaymentFindFirstOrThrowZodSchema = z.object({ select: PaymentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => PaymentIncludeObjectSchema.optional()), orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array()]).optional() }).strict();