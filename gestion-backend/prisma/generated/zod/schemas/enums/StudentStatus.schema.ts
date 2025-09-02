import { z } from 'zod';

export const StudentStatusSchema = z.enum(['Active', 'Inactive', 'Graduated'])