import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'status', 'lastLogin', 'avatar', 'password', 'createdAt', 'updatedAt'])