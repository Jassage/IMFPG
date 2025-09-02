import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema'

export const PaymentListRelationFilterObjectSchema: z.ZodType<Prisma.PaymentListRelationFilter, z.ZodTypeDef, Prisma.PaymentListRelationFilter> = z.object({
  every: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  some: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  none: z.lazy(() => PaymentWhereInputObjectSchema).optional()
}).strict();
export const PaymentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  some: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  none: z.lazy(() => PaymentWhereInputObjectSchema).optional()
}).strict();
