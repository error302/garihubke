'use client';

import { useState, useEffect } from 'react';

interface Member {
  id: string;
  role: string;
  user: { name: string; email: string };
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>
      <div className="space-y-4">
        {members.length === 0 ? (
          <p className="text-gray-500">No team members yet.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{member.user.name}</p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{member.role}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
