import { useEffect, useState } from "react";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { Invitation } from "@/types";
import { notifyTasksRefresh } from "@/lib/taskEvents";

function Noti() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const loadInvitations = () => {
    api.invitations.list().then(setInvitations).catch(console.error);
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleConfirm = async (id: string) => {
    await api.invitations.accept(id);
    loadInvitations();
    notifyTasksRefresh();
  };

  const handleCancel = async (id: string) => {
    await api.invitations.reject(id);
    loadInvitations();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative cursor-pointer">
          <Icons.noti />
          {invitations.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {invitations.length}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            You have {invitations.length} pending invitation
            {invitations.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-100 space-y-3 overflow-y-auto">
          {invitations.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No pending invitations.
            </div>
          ) : (
            invitations.map((invite) => (
              <div
                key={invite.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {invite.invitedBy}
                  </span>{" "}
                  invited you to join:
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  {invite.taskName}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(invite.id)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleConfirm(invite.id)}>
                    Confirm
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Noti;
