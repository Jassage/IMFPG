import { z } from 'zod';

export const UEPrerequisiteScalarFieldEnumSchema = z.enum(['id', 'ueId', 'prerequisiteId', 'createdAt', 'updatedAt'])