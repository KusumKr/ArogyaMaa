import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://arogyamaa.onrender.com";
    const payload = await req.json();

    const resp = await fetch(`${backendBase}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Forward cookies/credentials only if your backend expects them; usually not needed here
    });

    const text = await resp.text();
    const contentType = resp.headers.get("content-type") || "application/json";
    return new NextResponse(text, { status: resp.status, headers: { "content-type": contentType } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Proxy error" }, { status: 500 });
  }
}
