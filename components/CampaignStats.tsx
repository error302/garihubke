interface CampaignStatsProps {
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
}

export default function CampaignStats({ impressions, clicks, budget, spent }: CampaignStatsProps) {
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0';
  const remaining = budget - spent;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Impressions</p>
        <p className="text-2xl font-bold">{impressions.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Clicks</p>
        <p className="text-2xl font-bold">{clicks.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">CTR</p>
        <p className="text-2xl font-bold">{ctr}%</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 text-sm">Remaining Budget</p>
        <p className="text-2xl font-bold">KSh {remaining.toLocaleString()}</p>
      </div>
    </div>
  );
}
