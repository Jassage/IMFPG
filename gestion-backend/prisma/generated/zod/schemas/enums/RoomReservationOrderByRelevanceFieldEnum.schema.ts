import { z } from 'zod';

export const RoomReservationOrderByRelevanceFieldEnumSchema = z.enum(['id', 'roomId', 'userId', 'purpose', 'status'])