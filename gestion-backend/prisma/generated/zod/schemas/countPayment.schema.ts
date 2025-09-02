import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { PaymentOrderByWithRelationInputObjectSchema } from './objects/PaymentOrderByWithRelationInput.schema';
import { PaymentWhereInputObjectSchema } from './objects/PaymentWhereInput.schema';
import { PaymentWhereUniqueInputObjectSchema } from './objects/PaymentWhereUniqueInput.schema';
import { PaymentCountAggregateInputObjectSchema } from './objects/PaymentCountAggregateInput.schema';

export const PaymentCountSchema: z.ZodType<Prisma.PaymentCountArgs, z.ZodTypeDef, Prisma.PaymentCountArgs> = z.object({ orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PaymentCountAggregateInputObjectSchema ]).optional() }).strict();

export const PaymentCountZodSchema = z.object({ orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PaymentCountAggregateInputObjectSchema ]).optional() }).strict();