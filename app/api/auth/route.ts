export async function POST(req: Request) {
  const body = await req.json();

  if (body.password === process.env.APP_PASSWORD) {
    return Response.json({ ok: true });
  }

  return Response.json(
    { ok: false },
    { status: 401 }
  );
}