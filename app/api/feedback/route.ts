import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Define backend base URL — your Render backend
    const backendBase =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://arogyamaa.onrender.com";

    // ✅ Remove any trailing slash to prevent "//api"
    const cleanBase = backendBase.replace(/\/$/, "");

    // ✅ Parse the incoming request payload
    const payload = await req.json();

    // ✅ Forward the request to your backend's /api/feedback endpoint
    const resp = await fetch(`${cleanBase}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ Return backend response to frontend
    const text = await resp.text();
    const contentType = resp.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: resp.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    console.error("Feedback Proxy Error:", err);
    return NextResponse.json(
      { error: err?.message || "Proxy error" },
      { status: 500 }
    );
  }
}
