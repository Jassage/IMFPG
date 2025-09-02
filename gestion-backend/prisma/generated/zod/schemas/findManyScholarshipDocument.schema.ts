import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipDocumentIncludeObjectSchema } from './objects/ScholarshipDocumentInclude.schema';
import { ScholarshipDocumentOrderByWithRelationInputObjectSchema } from './objects/ScholarshipDocumentOrderByWithRelationInput.schema';
import { ScholarshipDocumentWhereInputObjectSchema } from './objects/ScholarshipDocumentWhereInput.schema';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './objects/ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentScalarFieldEnumSchema } from './enums/ScholarshipDocumentScalarFieldEnum.schema';
import { ScholarshipApplicationArgsObjectSchema } from './objects/ScholarshipApplicationArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ScholarshipDocumentFindManySelectSchema: z.ZodType<Prisma.ScholarshipDocumentSelect, z.ZodTypeDef, Prisma.ScholarshipDocumentSelect> = z.object({
    id: z.boolean().optional(),
    scholarshipApplicationId: z.boolean().optional(),
    scholarshipApplication: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const ScholarshipDocumentFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    scholarshipApplicationId: z.boolean().optional(),
    scholarshipApplication: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const ScholarshipDocumentFindManySchema: z.ZodType<Prisma.ScholarshipDocumentFindManyArgs, z.ZodTypeDef, Prisma.ScholarshipDocumentFindManyArgs> = z.object({ select: ScholarshipDocumentFindManySelectSchema.optional(), include: z.lazy(() => ScholarshipDocumentIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipDocumentOrderByWithRelationInputObjectSchema, ScholarshipDocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipDocumentWhereInputObjectSchema.optional(), cursor: ScholarshipDocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipDocumentScalarFieldEnumSchema, ScholarshipDocumentScalarFieldEnumSchema.array()]).optional() }).strict();

export const ScholarshipDocumentFindManyZodSchema = z.object({ select: ScholarshipDocumentFindManySelectSchema.optional(), include: z.lazy(() => ScholarshipDocumentIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipDocumentOrderByWithRelationInputObjectSchema, ScholarshipDocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipDocumentWhereInputObjectSchema.optional(), cursor: ScholarshipDocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipDocumentScalarFieldEnumSchema, ScholarshipDocumentScalarFieldEnumSchema.array()]).optional() }).strict();