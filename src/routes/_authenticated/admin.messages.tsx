import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminDeleteMessage,
  adminFlagMessage,
  adminListMessages,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListMessages);
  const flag = useServerFn(adminFlagMessage);
  const remove = useServerFn(adminDeleteMessage);

  const messages = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => list(),
  });

  const flagMutation = useMutation({
    mutationFn: (vars: { id: string; handled: boolean }) => flag({ data: vars }),
    onSuccess: () => void queryClient.invalidateQueries(),
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Message deleted.");
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Inbox</h2>
      <ul className="space-y-4">
        {(messages.data ?? []).map((message) => (
          <li key={message.id} className="border border-hairline bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-foreground">
                  {message.name} ·{" "}
                  <a
                    href={`mailto:${message.email}`}
                    className="text-primary hover:underline"
                  >
                    {message.email}
                  </a>
                </p>
                <p className="technical-label mt-1">
                  {new Date(message.created_at).toLocaleString()} ·{" "}
                  {message.handled ? "handled" : "new"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    flagMutation.mutate({ id: message.id, handled: !message.handled })
                  }
                >
                  {message.handled ? "Mark new" : "Mark handled"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(message.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            {message.subject && (
              <p className="mt-4 text-sm font-medium text-foreground">
                {message.subject}
              </p>
            )}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {message.message}
            </p>
          </li>
        ))}
        {messages.data?.length === 0 && (
          <li className="text-sm text-muted-foreground">No messages yet.</li>
        )}
      </ul>
    </div>
  );
}