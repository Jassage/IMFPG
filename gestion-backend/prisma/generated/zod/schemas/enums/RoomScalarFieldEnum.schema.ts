import { z } from 'zod';

export const RoomScalarFieldEnumSchema = z.enum(['id', 'name', 'type', 'capacity', 'location', 'status'])