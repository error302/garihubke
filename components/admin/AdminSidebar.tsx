import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/crsp', label: 'CRSP Data', icon: '📋' },
  { href: '/admin/tax-rates', label: 'Tax Rates', icon: '💰' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="space-y-2">
        {adminLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
