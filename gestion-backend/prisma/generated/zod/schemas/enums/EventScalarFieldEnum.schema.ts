import { z } from 'zod';

export const EventScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'startDate', 'endDate', 'location', 'organizer', 'category', 'isPublic', 'status'])