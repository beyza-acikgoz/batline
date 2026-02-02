import Header from "@/components/Header";
import QrScanner from "@/components/QrScanner";

export default async function DashboardPage() {
  const res = await fetch("http://localhost:3000/api/module-procedure?qr=00012345", {
    cache: "no-store",
  });


  const data = await res.json();
  console.log(data);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 text-center text-2xl font-bold">
        <Header />
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <QrScanner />
      </main>
    </div>
  );
}
