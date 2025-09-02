import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnnouncementAttachmentIncludeObjectSchema } from './objects/AnnouncementAttachmentInclude.schema';
import { AnnouncementAttachmentOrderByWithRelationInputObjectSchema } from './objects/AnnouncementAttachmentOrderByWithRelationInput.schema';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentScalarFieldEnumSchema } from './enums/AnnouncementAttachmentScalarFieldEnum.schema';
import { AnnouncementArgsObjectSchema } from './objects/AnnouncementArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AnnouncementAttachmentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.AnnouncementAttachmentSelect, z.ZodTypeDef, Prisma.AnnouncementAttachmentSelect> = z.object({
    id: z.boolean().optional(),
    announcementId: z.boolean().optional(),
    announcement: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const AnnouncementAttachmentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    announcementId: z.boolean().optional(),
    announcement: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const AnnouncementAttachmentFindFirstOrThrowSchema: z.ZodType<Prisma.AnnouncementAttachmentFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.AnnouncementAttachmentFindFirstOrThrowArgs> = z.object({ select: AnnouncementAttachmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AnnouncementAttachmentIncludeObjectSchema.optional()), orderBy: z.union([AnnouncementAttachmentOrderByWithRelationInputObjectSchema, AnnouncementAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementAttachmentWhereInputObjectSchema.optional(), cursor: AnnouncementAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnnouncementAttachmentScalarFieldEnumSchema, AnnouncementAttachmentScalarFieldEnumSchema.array()]).optional() }).strict();

export const AnnouncementAttachmentFindFirstOrThrowZodSchema = z.object({ select: AnnouncementAttachmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AnnouncementAttachmentIncludeObjectSchema.optional()), orderBy: z.union([AnnouncementAttachmentOrderByWithRelationInputObjectSchema, AnnouncementAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnnouncementAttachmentWhereInputObjectSchema.optional(), cursor: AnnouncementAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AnnouncementAttachmentScalarFieldEnumSchema, AnnouncementAttachmentScalarFieldEnumSchema.array()]).optional() }).strict();