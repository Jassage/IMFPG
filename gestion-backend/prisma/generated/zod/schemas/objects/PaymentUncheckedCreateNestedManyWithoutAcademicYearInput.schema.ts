import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateWithoutAcademicYearInputObjectSchema } from './PaymentCreateWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateWithoutAcademicYearInput.schema';
import { PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './PaymentCreateOrConnectWithoutAcademicYearInput.schema';
import { PaymentCreateManyAcademicYearInputEnvelopeObjectSchema } from './PaymentCreateManyAcademicYearInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

export const PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentUncheckedCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
