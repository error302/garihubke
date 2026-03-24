interface PremiumBadgeProps {
  type: 'featured' | 'verified' | 'premium';
}

export default function PremiumBadge({ type }: PremiumBadgeProps) {
  const badges = {
    featured: {
      text: 'Featured',
      bg: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '⭐',
    },
    verified: {
      text: 'Verified',
      bg: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '✓',
    },
    premium: {
      text: 'Premium',
      bg: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '👑',
    },
  };

  const badge = badges[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.textColor}`}>
      <span>{badge.icon}</span>
      <span>{badge.text}</span>
    </span>
  );
}
