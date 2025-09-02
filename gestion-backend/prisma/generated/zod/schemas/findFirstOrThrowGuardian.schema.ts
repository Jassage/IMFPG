import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { GuardianIncludeObjectSchema } from './objects/GuardianInclude.schema';
import { GuardianOrderByWithRelationInputObjectSchema } from './objects/GuardianOrderByWithRelationInput.schema';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';
import { GuardianScalarFieldEnumSchema } from './enums/GuardianScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const GuardianFindFirstOrThrowSelectSchema: z.ZodType<Prisma.GuardianSelect, z.ZodTypeDef, Prisma.GuardianSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    relationship: z.boolean().optional(),
    phone: z.boolean().optional(),
    email: z.boolean().optional(),
    address: z.boolean().optional(),
    isPrimary: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const GuardianFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    relationship: z.boolean().optional(),
    phone: z.boolean().optional(),
    email: z.boolean().optional(),
    address: z.boolean().optional(),
    isPrimary: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const GuardianFindFirstOrThrowSchema: z.ZodType<Prisma.GuardianFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.GuardianFindFirstOrThrowArgs> = z.object({ select: GuardianFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => GuardianIncludeObjectSchema.optional()), orderBy: z.union([GuardianOrderByWithRelationInputObjectSchema, GuardianOrderByWithRelationInputObjectSchema.array()]).optional(), where: GuardianWhereInputObjectSchema.optional(), cursor: GuardianWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([GuardianScalarFieldEnumSchema, GuardianScalarFieldEnumSchema.array()]).optional() }).strict();

export const GuardianFindFirstOrThrowZodSchema = z.object({ select: GuardianFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => GuardianIncludeObjectSchema.optional()), orderBy: z.union([GuardianOrderByWithRelationInputObjectSchema, GuardianOrderByWithRelationInputObjectSchema.array()]).optional(), where: GuardianWhereInputObjectSchema.optional(), cursor: GuardianWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([GuardianScalarFieldEnumSchema, GuardianScalarFieldEnumSchema.array()]).optional() }).strict();