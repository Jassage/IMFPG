import { z } from 'zod';

export const RoomOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'type', 'location', 'status'])