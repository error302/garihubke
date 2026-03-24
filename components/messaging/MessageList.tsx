"use client";

import { useState, useEffect } from "react";
import { vehicles } from "@/data/vehicles";

interface Message {
  id: string;
  vehicleId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleTitle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle?.title || "Unknown Vehicle";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div key={message.id} className={`p-4 ${!message.read ? 'bg-blue-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">
                  {getVehicleTitle(message.vehicleId)}
                </p>
                <p className="text-sm text-gray-500">
                  From: {message.senderName} ({message.senderEmail})
                </p>
                {message.senderPhone && (
                  <p className="text-sm text-gray-500">
                    Phone: {message.senderPhone}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(message.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{message.content}</p>
            <div className="mt-3">
              <a
                href={`mailto:${message.senderEmail}?subject=Re: ${getVehicleTitle(message.vehicleId)}`}
                className="inline-block px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Reply via Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
