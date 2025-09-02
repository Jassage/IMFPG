import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentSelectObjectSchema } from './PaymentSelect.schema';
import { PaymentIncludeObjectSchema } from './PaymentInclude.schema'

export const PaymentArgsObjectSchema = z.object({
  select: z.lazy(() => PaymentSelectObjectSchema).optional(),
  include: z.lazy(() => PaymentIncludeObjectSchema).optional()
}).strict();
export const PaymentArgsObjectZodSchema = z.object({
  select: z.lazy(() => PaymentSelectObjectSchema).optional(),
  include: z.lazy(() => PaymentIncludeObjectSchema).optional()
}).strict();
