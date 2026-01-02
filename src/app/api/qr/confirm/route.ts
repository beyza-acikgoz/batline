import { NextResponse } from "next/server";
import { assignQrToPackLoad } from "@/lib/stationMoment";

export async function POST(req: Request) {
  const { qr } = await req.json();

  await assignQrToPackLoad(qr);

  return NextResponse.json({
    action: "OPEN_FC",
    station: "PackLoad",
  });
}
