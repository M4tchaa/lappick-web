import { useState } from "react";
import LaptopCard from "@/components/LaptopCard";
import { Button } from "@/components/ui/button";
import type { LaptopRecommendation } from "@/App";

export default function LaptopList({ data, onBack }: { data: LaptopRecommendation[]; onBack: () => void }) {
    const itemsPerPage = 12;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginated = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center mb-4 max-w-screen-xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-purple-400">Rekomendasi Laptop untukmu</h1>
                <Button variant="outline" onClick={onBack} className="gap-2">🔄 Ulangi</Button>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 w-full max-w-screen-2xl mx-auto px-4">
                {paginated.map((item, idx) => (
                    <LaptopCard key={idx} data={item} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6 max-w-screen-xl mx-auto px-4">
                <Button variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Sebelumnya</Button>
                <div className="text-sm text-white">Halaman {page} dari {totalPages}</div>
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Selanjutnya</Button>
            </div>
        </div>

    );
}
