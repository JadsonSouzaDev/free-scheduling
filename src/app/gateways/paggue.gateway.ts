type PixPaymentRequest = {
  payer_name: string;
  amount: number;
  external_id: string;
  description: string;
}

type PixPayment = {
  hash: string;
  status: number;
  reference: string;
  paid_at: Date | null;
  external_id: string;
}

export type PixPaymentResponse = {
  payment: string;
} & PixPayment;

export type PixPaymentWebhook = {
  id: string;
} & PixPayment;


export class PaggueGateway {
  private PAGGUE_API_URL = process.env.PAGGUE_API_URL;
  private PAGGUE_CLIENT_KEY = process.env.PAGGUE_CLIENT_KEY;
  private PAGGUE_CLIENT_SECRET = process.env.PAGGUE_CLIENT_SECRET;

  private static instance: PaggueGateway;

  private constructor() {}

  public static getInstance(): PaggueGateway {
    if (!PaggueGateway.instance) {
      PaggueGateway.instance = new PaggueGateway();
    }
    return PaggueGateway.instance;
  }

  async getAuthToken() {
    const response = await fetch(`${this.PAGGUE_API_URL}/auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_key: this.PAGGUE_CLIENT_KEY, client_secret: this.PAGGUE_CLIENT_SECRET }), 
    });
    const data = await response.json();
    return data.access_token;
  }

  async createPayment(payment: PixPaymentRequest) {
    const authToken = await this.getAuthToken();

    const response = await fetch(`${this.PAGGUE_API_URL}/cashin/api/billing_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "x-company-id": "1",
      },
      body: JSON.stringify({...payment, amount: payment.amount * 100}),
    });
    const data = await response.json() as PixPaymentResponse;
    return data;
  }
}
