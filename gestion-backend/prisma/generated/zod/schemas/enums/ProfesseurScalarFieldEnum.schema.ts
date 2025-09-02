import { z } from 'zod';

export const ProfesseurScalarFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'email', 'phone', 'department', 'office', 'hireDate', 'status', 'speciality', 'userId', 'createdAt', 'updatedAt'])