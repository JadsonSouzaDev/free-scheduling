export enum PaymentType {
  PIX = "pix",
  MANUAL = "manual",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export enum AppointmentStatus {
  WAITING_PAYMENT = "waiting_payment",
  PAID = "paid",
  CANCELLED = "cancelled",
  COMPLETED = "completed", 
}

export type PaymentData = {
  id: string;
  external_id: string;
  amount: number;
  status: PaymentStatus;
  paid_at: Date | null;
  qr_code: string;
  type: PaymentType;
  created_at: Date;
  updated_at: Date;
  appointment_id: string;
}

export type AppointmentData = {
  id: string;
  client_name: string;
  client_phone: string;
  date: Date;
  status: AppointmentStatus;
  created_at: Date;
  updated_at: Date;
};

export type AppointmentConstructorData = {
  id: string;
  client_name: string;
  client_phone: string;
  date: Date;
  status: AppointmentStatus;
  created_at: Date;
  updated_at: Date;
  payment: PaymentData;
};

export type AppointmentPayment = {
  id: string;
  externalId: string;
  status: PaymentStatus;
  paidAt: Date | null;
  qrCode: string;
  type: PaymentType;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
}

export class Appointment {
  id!: string;
  clientName!: string;
  clientPhone!: string;
  date!: Date;
  status!: AppointmentStatus;
  createdAt!: Date;
  updatedAt!: Date;
  payment!: AppointmentPayment;

  constructor(data: AppointmentConstructorData) {
    this.id = data.id;
    this.clientName = data.client_name;
    this.clientPhone = data.client_phone;
    this.date = data.date;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.payment = {
      id: data.payment.id,
      externalId: data.payment.external_id,
      amount: data.payment.amount,
      status: data.payment.status,
      paidAt: data.payment.paid_at,
      qrCode: data.payment.qr_code,
      type: data.payment.type,
      createdAt: data.payment.created_at,
      updatedAt: data.payment.updated_at,
    };
  }
}
