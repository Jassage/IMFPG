import { z } from 'zod';

export const AcademicYearScalarFieldEnumSchema = z.enum(['id', 'year', 'startDate', 'endDate', 'isCurrent', 'createdAt', 'updatedAt'])