import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutAcademicYearInputObjectSchema } from './PaymentCreateWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateWithoutAcademicYearInput.schema'

export const PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentCreateOrConnectWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
