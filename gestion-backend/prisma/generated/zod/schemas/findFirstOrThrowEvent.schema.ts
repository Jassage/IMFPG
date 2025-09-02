import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EventIncludeObjectSchema } from './objects/EventInclude.schema';
import { EventOrderByWithRelationInputObjectSchema } from './objects/EventOrderByWithRelationInput.schema';
import { EventWhereInputObjectSchema } from './objects/EventWhereInput.schema';
import { EventWhereUniqueInputObjectSchema } from './objects/EventWhereUniqueInput.schema';
import { EventScalarFieldEnumSchema } from './enums/EventScalarFieldEnum.schema';
import { EventParticipantArgsObjectSchema } from './objects/EventParticipantArgs.schema';
import { EventCountOutputTypeArgsObjectSchema } from './objects/EventCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EventFindFirstOrThrowSelectSchema: z.ZodType<Prisma.EventSelect, z.ZodTypeDef, Prisma.EventSelect> = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    location: z.boolean().optional(),
    organizer: z.boolean().optional(),
    category: z.boolean().optional(),
    participants: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    status: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const EventFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    location: z.boolean().optional(),
    organizer: z.boolean().optional(),
    category: z.boolean().optional(),
    participants: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    status: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const EventFindFirstOrThrowSchema: z.ZodType<Prisma.EventFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.EventFindFirstOrThrowArgs> = z.object({ select: EventFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => EventIncludeObjectSchema.optional()), orderBy: z.union([EventOrderByWithRelationInputObjectSchema, EventOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventWhereInputObjectSchema.optional(), cursor: EventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array()]).optional() }).strict();

export const EventFindFirstOrThrowZodSchema = z.object({ select: EventFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => EventIncludeObjectSchema.optional()), orderBy: z.union([EventOrderByWithRelationInputObjectSchema, EventOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventWhereInputObjectSchema.optional(), cursor: EventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array()]).optional() }).strict();