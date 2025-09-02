import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { UEPrerequisiteIncludeObjectSchema } from './objects/UEPrerequisiteInclude.schema';
import { UEPrerequisiteOrderByWithRelationInputObjectSchema } from './objects/UEPrerequisiteOrderByWithRelationInput.schema';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteScalarFieldEnumSchema } from './enums/UEPrerequisiteScalarFieldEnum.schema';
import { UEArgsObjectSchema } from './objects/UEArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UEPrerequisiteFindFirstOrThrowSelectSchema: z.ZodType<Prisma.UEPrerequisiteSelect, z.ZodTypeDef, Prisma.UEPrerequisiteSelect> = z.object({
    id: z.boolean().optional(),
    ueId: z.boolean().optional(),
    prerequisiteId: z.boolean().optional(),
    ue: z.boolean().optional(),
    prerequisite: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const UEPrerequisiteFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    ueId: z.boolean().optional(),
    prerequisiteId: z.boolean().optional(),
    ue: z.boolean().optional(),
    prerequisite: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const UEPrerequisiteFindFirstOrThrowSchema: z.ZodType<Prisma.UEPrerequisiteFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.UEPrerequisiteFindFirstOrThrowArgs> = z.object({ select: UEPrerequisiteFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => UEPrerequisiteIncludeObjectSchema.optional()), orderBy: z.union([UEPrerequisiteOrderByWithRelationInputObjectSchema, UEPrerequisiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEPrerequisiteWhereInputObjectSchema.optional(), cursor: UEPrerequisiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UEPrerequisiteScalarFieldEnumSchema, UEPrerequisiteScalarFieldEnumSchema.array()]).optional() }).strict();

export const UEPrerequisiteFindFirstOrThrowZodSchema = z.object({ select: UEPrerequisiteFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => UEPrerequisiteIncludeObjectSchema.optional()), orderBy: z.union([UEPrerequisiteOrderByWithRelationInputObjectSchema, UEPrerequisiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEPrerequisiteWhereInputObjectSchema.optional(), cursor: UEPrerequisiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UEPrerequisiteScalarFieldEnumSchema, UEPrerequisiteScalarFieldEnumSchema.array()]).optional() }).strict();