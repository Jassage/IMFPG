import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnnouncementIncludeObjectSchema } from './objects/AnnouncementInclude.schema';
import { AnnouncementOrderByWithRelationInputObjectSchema } from './objects/AnnouncementOrderByWithRelationInput.schema';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';
import { AnnouncementScalarFieldEnumSchema } from './enums/AnnouncementScalarFieldEnum.schema';
import { AnnouncementAttachmentArgsObjectSchema } from './objects/AnnouncementAttachmentArgs.schema';
import { AnnouncementCountOutputTypeArgsObjectSchema } from './objects/AnnouncementCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AnnouncementFindFirstSelectSchema: z.ZodType<Prisma.AnnouncementSelect, z.ZodTypeDef, Prisma.AnnouncementSelect> = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    content: z.boolean().optional(),
    authorId: z.boolean().optional(),
    publishDate: z.boolean().optional(),
    expiryDate: z.boolean().optional(),
    targetAudience: z.boolean().optional(),
    priority: z.boolean().optional(),
    attachments: z.boolean().optional(),
    isActive: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AnnouncementFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    content: z.boolean().optional(),
    authorId: z.boolean().optional(),
    publishDate: z.boolean().optional(),
    expiryDate: z.boolean().optional(),
    targetAudience: z.boolean().optional(),
    priority: z.boolean().optional(),
    attachments: z.boolean().optional(),
    isActive: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AnnouncementFindFirstSchema: z.ZodType<Prisma.AnnouncementFindFirstArgs, z.ZodTypeDef, Prisma.AnnouncementFindFirstArgs> = z.object({ select: AnnouncementFindFirstSelectSchema.optional(), include: z.lazy(() => AnnouncementIncludeObjectSchema.optional()), orderBy: z.union([AnnouncementOrderByWithRelationInputObjectSchema, AnnouncementOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementWhereInputObjectSchema.optional(), cursor: AnnouncementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnnouncementScalarFieldEnumSchema, AnnouncementScalarFieldEnumSchema.array()]).optional() }).strict();

export const AnnouncementFindFirstZodSchema = z.object({ select: AnnouncementFindFirstSelectSchema.optional(), include: z.lazy(() => AnnouncementIncludeObjectSchema.optional()), orderBy: z.union([AnnouncementOrderByWithRelationInputObjectSchema, AnnouncementOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementWhereInputObjectSchema.optional(), cursor: AnnouncementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnnouncementScalarFieldEnumSchema, AnnouncementScalarFieldEnumSchema.array()]).optional() }).strict();