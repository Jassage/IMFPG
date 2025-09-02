import { z } from 'zod';

export const UEOrderByRelevanceFieldEnumSchema = z.enum(['id', 'code', 'title', 'description', 'objectives', 'createdById'])