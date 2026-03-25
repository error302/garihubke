import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Listings</h3>
            <p className="text-3xl font-bold text-primary-600">--</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Active Users</h3>
            <p className="text-3xl font-bold text-primary-600">--</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold text-primary-600">--</p>
          </div>
        </div>
      </main>
    </div>
  );
}
