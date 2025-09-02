import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutAcademicYearInputObjectSchema } from './PaymentUpdateWithoutAcademicYearInput.schema';
import { PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedUpdateWithoutAcademicYearInput.schema'

export const PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentUpdateWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const PaymentUpdateWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
