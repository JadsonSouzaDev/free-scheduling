const PAGGUE_API_URL = process.env.PAGUE_API_URL;
const PAGGUE_CLIENT_KEY = process.env.PAGUE_CLIENT_KEY;
const PAGGUE_CLIENT_SECRET = process.env.PAGUE_CLIENT_SECRET;

type PixPaymentRequest = {
  payer_name: number;
  amount: string;
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


export const PaggueGateway = {
  async getAuthToken() {
    const response = await fetch(`${PAGGUE_API_URL}/auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_key: PAGGUE_CLIENT_KEY, client_secret: PAGGUE_CLIENT_SECRET }), 
    });
    const data = await response.json();
    return data.access_token;
  },

  async createPayment(payment: PixPaymentRequest) {
    const authToken = await this.getAuthToken();
    const response = await fetch(`${PAGGUE_API_URL}/cashin/api/billing_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payment),
    });
    const data = await response.json() as PixPaymentResponse;
    return data;
  },
};
