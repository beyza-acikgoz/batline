import { NextResponse } from "next/server";
import { getByQr, getStation } from "@/lib/stationMoment";

export async function POST(req: Request) {
  const { qr } = await req.json();

  const record = await getByQr(qr);

  // QR YOK
  if (!record) {
    const packLoad = await getStation("PackLoad");

    if (packLoad.product_id) {
      return NextResponse.json({
        action: "WARNING",
        message: "PackLoad dolu, yeni ürün alınamaz",
      });
    }

    return NextResponse.json({
      action: "CONFIRM_NEW",
      station: "PackLoad",
      message: "Bu QR'lı ürünü hatta almak istiyor musunuz?",
    });
  }

  // QR VAR
  if (!record.fc && !record.done && !record.qc) {
    return NextResponse.json({
      action: "OPEN_FC",
      station: record.station_id,
    });
  }

  if (record.fc && !record.done) {
    return NextResponse.json({
      action: "WARNING",
      message: "FC doldurulmuş. QC için Done tuşuna basın.",
    });
  }

  if (record.fc && record.done && !record.qc) {
    return NextResponse.json({
      action: "OPEN_QC",
      station: record.station_id,
    });
  }

  return NextResponse.json({
    action: "WARNING",
    message: "Bu ürün için tüm formlar doldurulmuştur",
  });
}
