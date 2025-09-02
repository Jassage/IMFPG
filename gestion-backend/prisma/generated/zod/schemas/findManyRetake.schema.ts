import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RetakeIncludeObjectSchema } from './objects/RetakeInclude.schema';
import { RetakeOrderByWithRelationInputObjectSchema } from './objects/RetakeOrderByWithRelationInput.schema';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';
import { RetakeScalarFieldEnumSchema } from './enums/RetakeScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { UEArgsObjectSchema } from './objects/UEArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RetakeFindManySelectSchema: z.ZodType<Prisma.RetakeSelect, z.ZodTypeDef, Prisma.RetakeSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    originalGrade: z.boolean().optional(),
    retakeGrade: z.boolean().optional(),
    scheduledSemester: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const RetakeFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    originalGrade: z.boolean().optional(),
    retakeGrade: z.boolean().optional(),
    scheduledSemester: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const RetakeFindManySchema: z.ZodType<Prisma.RetakeFindManyArgs, z.ZodTypeDef, Prisma.RetakeFindManyArgs> = z.object({ select: RetakeFindManySelectSchema.optional(), include: z.lazy(() => RetakeIncludeObjectSchema.optional()), orderBy: z.union([RetakeOrderByWithRelationInputObjectSchema, RetakeOrderByWithRelationInputObjectSchema.array()]).optional(), where: RetakeWhereInputObjectSchema.optional(), cursor: RetakeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RetakeScalarFieldEnumSchema, RetakeScalarFieldEnumSchema.array()]).optional() }).strict();

export const RetakeFindManyZodSchema = z.object({ select: RetakeFindManySelectSchema.optional(), include: z.lazy(() => RetakeIncludeObjectSchema.optional()), orderBy: z.union([RetakeOrderByWithRelationInputObjectSchema, RetakeOrderByWithRelationInputObjectSchema.array()]).optional(), where: RetakeWhereInputObjectSchema.optional(), cursor: RetakeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RetakeScalarFieldEnumSchema, RetakeScalarFieldEnumSchema.array()]).optional() }).strict();