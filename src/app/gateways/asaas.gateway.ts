type PixPaymentRequest = {
  amount: number;
  external_id: string;
  description: string;
};

type PixPayment = {
  id: string;
  payload: number;
};

export type PixPaymentWebhook = {
  event: string;
  payment: {
    pixQrCodeId: string;
    status: string;
    externalReference: string;
  };
};

export class AsaasGateway {
  private ASAAS_API_URL = process.env.ASAAS_API_URL;
  private ASAAS_TOKEN = process.env.ASAAS_TOKEN;
  private ASAAS_PIX_KEY = process.env.ASAAS_PIX_KEY;

  private static instance: AsaasGateway;

  private constructor() {}

  public static getInstance(): AsaasGateway {
    if (!AsaasGateway.instance) {
      AsaasGateway.instance = new AsaasGateway();
    }
    return AsaasGateway.instance;
  }

  async createPayment(payment: PixPaymentRequest) {
    const body = {
      addressKey: this.ASAAS_PIX_KEY,
      expirationSeconds: 300,
      value: payment.amount,
      externalReference: payment.external_id,
      description: payment.description.slice(0, 37),
    };

    const response = await fetch(`${this.ASAAS_API_URL}/pix/qrCodes/static`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: `$${this.ASAAS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as PixPayment;
    return data;
  }
}
