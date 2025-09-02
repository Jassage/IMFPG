import { z } from 'zod';

export const AnalyticsScalarFieldEnumSchema = z.enum(['id', 'type', 'data', 'generatedDate', 'parameters'])