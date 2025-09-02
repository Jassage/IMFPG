import { z } from 'zod';

export const UEScalarFieldEnumSchema = z.enum(['id', 'code', 'title', 'credits', 'type', 'passingGrade', 'description', 'objectives', 'createdAt', 'updatedAt', 'createdById'])