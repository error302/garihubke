"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface ContactFormProps {
  vehicleId: string;
  vehicleTitle: string;
}

export function ContactForm({ vehicleId, vehicleTitle }: ContactFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    senderName: session?.user?.name || "",
    senderEmail: session?.user?.email || "",
    senderPhone: "",
    content: `Hi, I'm interested in your ${vehicleTitle}. Please contact me with more information.`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          ...formData,
        }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({
          senderName: session?.user?.name || "",
          senderEmail: session?.user?.email || "",
          senderPhone: "",
          content: `Hi, I'm interested in your ${vehicleTitle}. Please contact me with more information.`,
        });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Something went wrong");
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
          <p className="text-gray-600 mt-2">The seller will contact you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            value={formData.senderEmail}
            onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
          <input
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Message *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
