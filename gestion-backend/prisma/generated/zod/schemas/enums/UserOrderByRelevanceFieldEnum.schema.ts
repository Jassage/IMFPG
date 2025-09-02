import { z } from 'zod';

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'password'])