import { MessageList } from "@/components/messaging/MessageList";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageList />
    </div>
  );
}
