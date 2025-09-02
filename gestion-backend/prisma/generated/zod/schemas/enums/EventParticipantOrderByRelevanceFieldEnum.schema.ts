import { z } from 'zod';

export const EventParticipantOrderByRelevanceFieldEnumSchema = z.enum(['id', 'eventId', 'name'])