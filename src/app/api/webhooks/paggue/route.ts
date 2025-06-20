import { NextRequest } from "next/server";

export async function GET() {
  return new Response("OK");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  return new Response("OK");
}