import { z } from 'zod';

export const EnrollmentStatusSchema = z.enum(['Active', 'Suspended', 'Completed'])