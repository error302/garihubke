import AdminSidebar from '@/components/admin/AdminSidebar';

const taxRateCategories = [
  { key: 'importDuty', label: 'Import Duty', rate: 25 },
  { key: 'vat', label: 'VAT', rate: 16 },
  { key: 'idf', label: 'IDF', rate: 3.5 },
  { key: 'rdl', label: 'RDL', rate: 2 },
];

export default function TaxRatesPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tax Rates Configuration</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-6">
            Current tax rates (as per KRA guidelines).
          </p>
          <div className="grid gap-4">
            {taxRateCategories.map(rate => (
              <div key={rate.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{rate.label}</h3>
                  <p className="text-sm text-gray-500">Key: {rate.key}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">{rate.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
