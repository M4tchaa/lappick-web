import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LaptopRecommendation } from "@/App";

export default function LaptopCard({ data }: { data: LaptopRecommendation }) {
  return (
    <Card className="bg-gray-900 text-white shadow-lg transition hover:scale-[1.01] min-h-[260px]">
      <CardContent className="p-5 space-y-2">
        <div className="text-lg font-semibold">{data.Brand} {data.Model}</div>
        <div className="text-xs px-2 py-1 rounded-full bg-purple-700 w-fit">RECOMMENDED</div>

        <div className="text-sm text-zinc-300">
          <span className="font-medium">CPU:</span> {data.CPU}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="font-medium">GPU:</span> {data.GPU}
        </div>
        {data.Category && (
          <div className="text-sm text-zinc-400 italic">
            {data.Category}
          </div>
        )}

        <div className="text-sm text-zinc-300 mt-2">Match Score:</div>
        <Progress value={data.Match_Score ?? 0} className="mb-1" />
        <div className="text-xl font-bold text-lime-400">
          Rp {typeof data.Price === "number" ? data.Price.toLocaleString("id-ID") : data.Price}
        </div>
      </CardContent>
    </Card>
  );
}
