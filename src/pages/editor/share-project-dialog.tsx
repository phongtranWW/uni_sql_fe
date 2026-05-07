import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import {
  CalendarClock,
  Loader2,
  Trash2,
  UserPlus,
  Users,
  Clock,
  Infinity,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/app/hook";
import {
  getShares,
  updateShares,
  revokeShares,
} from "@/features/project/thunks";
import type { Share } from "@/features/project/schemas/share.schema";
import defaultAvatar from "@/assets/defaults/avatar.jpg";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getMinDateTime = () =>
  new Date(Date.now() + 2 * 60 * 1000).toISOString().slice(0, 16);

const formatExpiry = (
  expiresAt: Date | null,
): { label: string; isExpired: boolean } => {
  if (!expiresAt) return { label: "No expiry", isExpired: false };
  const isExpired = expiresAt < new Date();
  const label = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(expiresAt);
  return { label, isExpired };
};

const getUserInitials = (share: Share): string => {
  const name = share.user?.name ?? share.user?.email;
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ShareItemProps {
  share: Share;
  isRevoking: boolean;
  onRevoke: (userId: string) => void;
}

const ShareItem = ({ share, isRevoking, onRevoke }: ShareItemProps) => {
  const { label: expiryLabel, isExpired } = formatExpiry(share.expiresAt);
  const displayName =
    share.user?.name ?? share.user?.email ?? share.userId.slice(0, 8) + "…";
  const displayEmail = share.user?.email;

  return (
    <div className="flex items-center gap-3 py-2.5 px-1">
      <Avatar size="default">
        <AvatarImage
          src={share.user?.avatar ?? defaultAvatar}
          alt={displayName}
        />
        <AvatarFallback className="text-xs font-medium">
          {getUserInitials(share)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">
          {displayName}
        </p>
        {displayEmail && displayName !== displayEmail && (
          <p className="truncate text-xs text-muted-foreground">
            {displayEmail}
          </p>
        )}
        <div className="mt-0.5 flex items-center gap-1">
          {share.expiresAt ? (
            <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
          ) : (
            <Infinity className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
          <span
            className={`text-xs ${
              isExpired
                ? "text-destructive font-medium"
                : "text-muted-foreground"
            }`}
          >
            {expiryLabel}
            {isExpired && " (expired)"}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        disabled={isRevoking}
        onClick={() => onRevoke(share.userId)}
        title="Revoke access"
      >
        {isRevoking ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
};

// ─── Main Dialog ──────────────────────────────────────────────────────────────

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareProjectDialog = ({
  open,
  onOpenChange,
}: ShareProjectDialogProps) => {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [shares, setShares] = useState<Share[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const [revokingIds, setRevokingIds] = useState<Set<string>>(new Set());

  const [userId, setUserId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userIdError, setUserIdError] = useState<string | null>(null);

  // ── Load shares on open ──────────────────────────────────────────────────
  const loadShares = useCallback(async () => {
    if (!projectId) return;
    setLoadingShares(true);
    try {
      const result = await dispatch(getShares(projectId)).unwrap();
      setShares(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load shares",
      );
    } finally {
      setLoadingShares(false);
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (open) {
      void loadShares();
    }
  }, [open, loadShares]);

  // ── Reset form on close ──────────────────────────────────────────────────
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setUserId("");
      setExpiresAt("");
      setUserIdError(null);
      setShares([]);
    }
    onOpenChange(next);
  };

  // ── Add / update share ───────────────────────────────────────────────────
  const validateUserId = (value: string): boolean => {
    if (!value.trim()) {
      setUserIdError("User ID is required.");
      return false;
    }
    if (!UUID_V4_REGEX.test(value.trim())) {
      setUserIdError("Must be a valid UUID v4.");
      return false;
    }
    setUserIdError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!projectId) return;
    if (!validateUserId(userId)) return;

    setSubmitting(true);
    try {
      const params: { userIds: string[]; expiresAt?: string } = {
        userIds: [userId.trim()],
      };
      if (expiresAt) {
        params.expiresAt = new Date(expiresAt).toISOString();
      }

      const updated = await dispatch(
        updateShares({ projectId, params }),
      ).unwrap();
      setShares(updated);
      setUserId("");
      setExpiresAt("");
      toast.success("Share updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update share",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Revoke share ─────────────────────────────────────────────────────────
  const handleRevoke = useCallback(
    async (targetUserId: string) => {
      if (!projectId) return;
      setRevokingIds((prev) => new Set(prev).add(targetUserId));
      try {
        const updated = await dispatch(
          revokeShares({ projectId, userIds: [targetUserId] }),
        ).unwrap();
        setShares(updated);
        toast.success("Access revoked.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to revoke share",
        );
      } finally {
        setRevokingIds((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
      }
    },
    [dispatch, projectId],
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="text-base">Share Project</DialogTitle>
          <DialogDescription className="text-sm">
            Grant or revoke collaborator access to this project.
          </DialogDescription>
        </DialogHeader>

        {/* Share list */}
        <div className="px-6 pt-4 pb-2">
          <div className="mb-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Shared with
            </span>
            {!loadingShares && shares.length > 0 && (
              <Badge variant="outline" className="ml-auto h-4.5 px-1.5 text-xs">
                {shares.length}
              </Badge>
            )}
          </div>

          {loadingShares ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : shares.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
              <Users className="mb-2 h-7 w-7 opacity-30" />
              <p className="text-sm">Not shared with anyone yet.</p>
            </div>
          ) : (
            <ScrollArea className="max-h-48">
              <div className="divide-y divide-border/60">
                {shares.map((share) => (
                  <ShareItem
                    key={share.userId}
                    share={share}
                    isRevoking={revokingIds.has(share.userId)}
                    onRevoke={handleRevoke}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <Separator className="mx-6 my-1 w-auto" />

        {/* Add / update form */}
        <div className="px-6 pt-3 pb-5 space-y-3">
          <div className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Add / Update
            </span>
          </div>

          {/* UUID input */}
          <div className="space-y-1">
            <Input
              placeholder="User ID (UUID v4)"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                if (userIdError) validateUserId(e.target.value);
              }}
              aria-invalid={!!userIdError}
              className="font-mono text-xs"
              spellCheck={false}
            />
            {userIdError && (
              <p className="text-xs text-destructive">{userIdError}</p>
            )}
          </div>

          {/* Expiry input */}
          <div className="space-y-1">
            <div className="relative">
              <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="datetime-local"
                value={expiresAt}
                min={getMinDateTime()}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] scheme-light dark:scheme-dark"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to share with no expiry.
            </p>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || !userId.trim()}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing…
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProjectDialog;
