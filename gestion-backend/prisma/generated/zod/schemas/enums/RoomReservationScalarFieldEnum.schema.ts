import { z } from 'zod';

export const RoomReservationScalarFieldEnumSchema = z.enum(['id', 'roomId', 'userId', 'startTime', 'endTime', 'purpose', 'status'])