import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutAcademicYearInputObjectSchema } from './PaymentUpdateWithoutAcademicYearInput.schema';
import { PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedUpdateWithoutAcademicYearInput.schema';
import { PaymentCreateWithoutAcademicYearInputObjectSchema } from './PaymentCreateWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateWithoutAcademicYearInput.schema'

export const PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentUpsertWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const PaymentUpsertWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
