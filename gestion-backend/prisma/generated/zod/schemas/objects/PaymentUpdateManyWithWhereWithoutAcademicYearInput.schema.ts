import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema';
import { PaymentUpdateManyMutationInputObjectSchema } from './PaymentUpdateManyMutationInput.schema';
import { PaymentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutAcademicYearInput.schema'

export const PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentUpdateManyWithWhereWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
export const PaymentUpdateManyWithWhereWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
