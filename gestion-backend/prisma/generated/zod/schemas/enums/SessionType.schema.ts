import { z } from 'zod';

export const SessionTypeSchema = z.enum(['Normale', 'Rattrapage'])