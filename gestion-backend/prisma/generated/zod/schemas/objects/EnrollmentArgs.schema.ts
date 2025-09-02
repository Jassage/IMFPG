import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentSelectObjectSchema } from './EnrollmentSelect.schema';
import { EnrollmentIncludeObjectSchema } from './EnrollmentInclude.schema'

export const EnrollmentArgsObjectSchema = z.object({
  select: z.lazy(() => EnrollmentSelectObjectSchema).optional(),
  include: z.lazy(() => EnrollmentIncludeObjectSchema).optional()
}).strict();
export const EnrollmentArgsObjectZodSchema = z.object({
  select: z.lazy(() => EnrollmentSelectObjectSchema).optional(),
  include: z.lazy(() => EnrollmentIncludeObjectSchema).optional()
}).strict();
