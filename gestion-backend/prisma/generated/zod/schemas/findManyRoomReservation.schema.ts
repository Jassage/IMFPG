import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { RoomReservationIncludeObjectSchema } from './objects/RoomReservationInclude.schema';
import { RoomReservationOrderByWithRelationInputObjectSchema } from './objects/RoomReservationOrderByWithRelationInput.schema';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';
import { RoomReservationScalarFieldEnumSchema } from './enums/RoomReservationScalarFieldEnum.schema';
import { RoomArgsObjectSchema } from './objects/RoomArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RoomReservationFindManySelectSchema: z.ZodType<Prisma.RoomReservationSelect, z.ZodTypeDef, Prisma.RoomReservationSelect> = z.object({
    id: z.boolean().optional(),
    room: z.boolean().optional(),
    roomId: z.boolean().optional(),
    userId: z.boolean().optional(),
    startTime: z.boolean().optional(),
    endTime: z.boolean().optional(),
    purpose: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const RoomReservationFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    room: z.boolean().optional(),
    roomId: z.boolean().optional(),
    userId: z.boolean().optional(),
    startTime: z.boolean().optional(),
    endTime: z.boolean().optional(),
    purpose: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const RoomReservationFindManySchema: z.ZodType<Prisma.RoomReservationFindManyArgs, z.ZodTypeDef, Prisma.RoomReservationFindManyArgs> = z.object({ select: RoomReservationFindManySelectSchema.optional(), include: z.lazy(() => RoomReservationIncludeObjectSchema.optional()), orderBy: z.union([RoomReservationOrderByWithRelationInputObjectSchema, RoomReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomReservationWhereInputObjectSchema.optional(), cursor: RoomReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomReservationScalarFieldEnumSchema, RoomReservationScalarFieldEnumSchema.array()]).optional() }).strict();

export const RoomReservationFindManyZodSchema = z.object({ select: RoomReservationFindManySelectSchema.optional(), include: z.lazy(() => RoomReservationIncludeObjectSchema.optional()), orderBy: z.union([RoomReservationOrderByWithRelationInputObjectSchema, RoomReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomReservationWhereInputObjectSchema.optional(), cursor: RoomReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RoomReservationScalarFieldEnumSchema, RoomReservationScalarFieldEnumSchema.array()]).optional() }).strict();