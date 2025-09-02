import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EventParticipantIncludeObjectSchema } from './objects/EventParticipantInclude.schema';
import { EventParticipantOrderByWithRelationInputObjectSchema } from './objects/EventParticipantOrderByWithRelationInput.schema';
import { EventParticipantWhereInputObjectSchema } from './objects/EventParticipantWhereInput.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './objects/EventParticipantWhereUniqueInput.schema';
import { EventParticipantScalarFieldEnumSchema } from './enums/EventParticipantScalarFieldEnum.schema';
import { EventArgsObjectSchema } from './objects/EventArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EventParticipantFindFirstOrThrowSelectSchema: z.ZodType<Prisma.EventParticipantSelect, z.ZodTypeDef, Prisma.EventParticipantSelect> = z.object({
    id: z.boolean().optional(),
    eventId: z.boolean().optional(),
    event: z.boolean().optional(),
    name: z.boolean().optional()
  }).strict();

export const EventParticipantFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    eventId: z.boolean().optional(),
    event: z.boolean().optional(),
    name: z.boolean().optional()
  }).strict();

export const EventParticipantFindFirstOrThrowSchema: z.ZodType<Prisma.EventParticipantFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.EventParticipantFindFirstOrThrowArgs> = z.object({ select: EventParticipantFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => EventParticipantIncludeObjectSchema.optional()), orderBy: z.union([EventParticipantOrderByWithRelationInputObjectSchema, EventParticipantOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventParticipantWhereInputObjectSchema.optional(), cursor: EventParticipantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EventParticipantScalarFieldEnumSchema, EventParticipantScalarFieldEnumSchema.array()]).optional() }).strict();

export const EventParticipantFindFirstOrThrowZodSchema = z.object({ select: EventParticipantFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => EventParticipantIncludeObjectSchema.optional()), orderBy: z.union([EventParticipantOrderByWithRelationInputObjectSchema, EventParticipantOrderByWithRelationInputObjectSchema.array()]).optional(), where: EventParticipantWhereInputObjectSchema.optional(), cursor: EventParticipantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EventParticipantScalarFieldEnumSchema, EventParticipantScalarFieldEnumSchema.array()]).optional() }).strict();