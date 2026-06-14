import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Task, TeamMember } from "@/types";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

function getInvitationLabel(status: TeamMember["invitationStatus"]) {
  if (status === "ACCEPTED") return "Already joined";
  if (status === "PENDING") return "Already invited";
  return null;
}

function InviteModal({ isOpen, onClose, task }: InviteModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen || !task) return;

    setSearchQuery("");
    setMembers([]);
    setSelectedMemberIds([]);
    setSelectedRoles({});
    setHasSearched(false);
    setIsSearching(false);
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setMembers([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSelectedMemberIds([]);
    setSelectedRoles({});

    try {
      const results = await api.users.search(query, task.id);
      setMembers(results);
    } catch (error) {
      console.error(error);
      setMembers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleMemberSelection = (member: TeamMember) => {
    if (member.invitationStatus) return;

    setSelectedMemberIds((current) => {
      if (current.includes(member.id)) {
        setSelectedRoles((roles) => {
          const nextRoles = { ...roles };
          delete nextRoles[member.id];
          return nextRoles;
        });
        return current.filter((id) => id !== member.id);
      }

      setSelectedRoles((roles) => ({
        ...roles,
        [member.id]: roles[member.id] ?? "Member",
      }));
      return [...current, member.id];
    });
  };

  const handleRoleChange = (memberId: string, role: string) => {
    setSelectedRoles((prev) => ({ ...prev, [memberId]: role }));
  };

  const handleInvite = async () => {
    if (selectedMemberIds.length === 0) return;

    setIsSubmitting(true);
    try {
      await Promise.all(
        selectedMemberIds.map((memberId) =>
          api.users.inviteToTask(
            task.id,
            memberId,
            selectedRoles[memberId] ?? "Member",
          ),
        ),
      );
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invite to Task</h2>
            <p className="text-sm text-gray-600">
              Add collaborators to {task.taskName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            Find team members
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter full email or full name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHasSearched(false);
                setMembers([]);
                setSelectedMemberIds([]);
                setSelectedRoles({});
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full"
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="shrink-0 bg-blue-900 text-white hover:bg-blue-800"
            >
              {isSearching ? "..." : "Search"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Type the exact full email or full name, then press Search.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wide text-gray-600 uppercase">
              Team Members
            </h3>
            {selectedMemberIds.length > 0 && (
              <span className="text-xs font-semibold text-blue-600">
                {selectedMemberIds.length} selected
              </span>
            )}
          </div>

          <div className="max-h-64 space-y-3 overflow-y-auto">
            {!hasSearched ? (
              <p className="text-sm text-gray-500">
                Enter the exact full email or full name to find a team member.
              </p>
            ) : isSearching ? (
              <p className="text-sm text-gray-500">Searching...</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-gray-500">
                No user found. Check the full email or full name and try again.
              </p>
            ) : (
              members.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                const isAlreadyInvited = Boolean(member.invitationStatus);
                const invitationLabel = getInvitationLabel(member.invitationStatus);

                return (
                  <div
                    key={member.id}
                    role={isAlreadyInvited ? undefined : "button"}
                    tabIndex={isAlreadyInvited ? undefined : 0}
                    onClick={() => toggleMemberSelection(member)}
                    onKeyDown={(event) => {
                      if (isAlreadyInvited) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleMemberSelection(member);
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                      isAlreadyInvited
                        ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-80"
                        : isSelected
                          ? "cursor-pointer border-blue-200 bg-blue-50"
                          : "cursor-pointer border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          isAlreadyInvited
                            ? "border-gray-200 bg-gray-100"
                            : isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && !isAlreadyInvited && (
                          <svg
                            viewBox="0 0 12 10"
                            className="h-3 w-3 fill-none stroke-current stroke-2"
                          >
                            <path d="M1 5.5L4.5 9 11 1" />
                          </svg>
                        )}
                      </span>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                        {member.avatar}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {isAlreadyInvited ? (
                      <span className="ml-3 shrink-0 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {invitationLabel}
                      </span>
                    ) : isSelected ? (
                      <select
                        value={selectedRoles[member.id] ?? "Member"}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          handleRoleChange(member.id, event.target.value)
                        }
                        className="ml-3 shrink-0 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        <option>Member</option>
                        <option>Admin</option>
                      </select>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={isSubmitting || selectedMemberIds.length === 0}
            className="flex-1 bg-blue-900 text-white hover:bg-blue-800"
          >
            {isSubmitting
              ? "Inviting..."
              : selectedMemberIds.length > 0
                ? `Invite (${selectedMemberIds.length})`
                : "Invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;
