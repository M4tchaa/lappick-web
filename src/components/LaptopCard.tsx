import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LaptopRecommendation } from "@/App";

export default function LaptopCard({ data }: { data: LaptopRecommendation }) {

  const scoreNormalized = Math.min(Math.round((data.Match_Score ?? 0) / 5), 100);

  return (
    <Card className="bg-gray-900 text-white shadow-lg transition hover:scale-[1.01] min-h-[260px]">
      <CardContent className="p-5 space-y-2">

        <div className="text-lg font-semibold">{data.Brand} {data.Model}</div>
        <div className="text-xs px-2 py-1 rounded-full bg-purple-700 w-fit">{data.Category?.toUpperCase()}</div>

        <div className="text-sm text-zinc-300">
          <span className="font-medium">CPU:</span> {data.CPU}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="font-medium">GPU:</span> {data.GPU}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="font-medium">RAM:</span> {data.RAM}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="font-medium">STORAGE:</span> {data.Storage}
        </div>

        <div className="text-sm text-zinc-300 mt-2">Match Score:</div>
        <Progress value={scoreNormalized} className="mb-1" />
        <div className="text-xl font-bold text-lime-400">
          Rp {typeof data.Price === "number" ? data.Price.toLocaleString("id-ID") : data.Price}
        </div>
      </CardContent>
    </Card>
  );
}
