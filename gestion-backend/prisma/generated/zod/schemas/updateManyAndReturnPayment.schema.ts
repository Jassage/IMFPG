import { z } from 'zod';
import { PaymentSelectObjectSchema } from './objects/PaymentSelect.schema';
import { PaymentUpdateManyMutationInputObjectSchema } from './objects/PaymentUpdateManyMutationInput.schema';
import { PaymentWhereInputObjectSchema } from './objects/PaymentWhereInput.schema';

export const PaymentUpdateManyAndReturnSchema = z.object({ select: PaymentSelectObjectSchema.optional(), data: PaymentUpdateManyMutationInputObjectSchema, where: PaymentWhereInputObjectSchema.optional()  }).strict()