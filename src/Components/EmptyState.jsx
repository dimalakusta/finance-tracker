import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Inbox size={28} />
      </div>

      <strong>{title}</strong>
    </div>
  );
}