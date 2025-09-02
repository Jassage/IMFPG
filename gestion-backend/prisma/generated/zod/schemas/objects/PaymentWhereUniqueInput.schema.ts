import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentWhereUniqueInputObjectSchema: z.ZodType<Prisma.PaymentWhereUniqueInput, z.ZodTypeDef, Prisma.PaymentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const PaymentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
