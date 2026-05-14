import { useState, useRef, useEffect } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { isToday, isYesterday, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

function groupSessions(sessions) {
  const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
  for (const session of sessions) {
    const date = new Date(session.updated_at);
    if (isToday(date)) groups.today.push(session);
    else if (isYesterday(date)) groups.yesterday.push(session);
    else if (isThisWeek(date)) groups.thisWeek.push(session);
    else groups.older.push(session);
  }
  return groups;
}

function SessionRow({ session, isActive, onSelect, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(session.title || "New Chat");
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  function handleRenameSubmit() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== session.title) onRename(trimmed);
    setRenaming(false);
  }

  if (renaming) {
    return (
      <div className="px-2 py-1">
        <input
          ref={inputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRenameSubmit();
            if (e.key === "Escape") setRenaming(false);
          }}
          onBlur={handleRenameSubmit}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    );
  }

  return (
    <div className="group/session relative">
      <button
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer",
          isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
        )}
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-50" />
        <span className="truncate flex-1">{session.title || "New Chat"}</span>
      </button>
      <div
        ref={menuRef}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2",
          menuOpen ? "opacity-100" : "opacity-0 group-hover/session:opacity-100"
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 bottom-full z-50 mb-1 w-36 rounded-lg border bg-popover p-1 shadow-lg">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setRenaming(true); }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                if (window.confirm("Delete this conversation?")) onDelete();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionGroup({ label, sessions, activeSessionId, onSelectSession, onRenameSession, onDeleteSession }) {
  if (sessions.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="px-3 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="space-y-0.5">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            isActive={activeSessionId === session.id}
            onSelect={() => onSelectSession(session.id)}
            onRename={(title) => onRenameSession(session.id, title)}
            onDelete={() => onDeleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatSidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onRenameSession, onDeleteSession, loading }) {
  const grouped = groupSessions(sessions);
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-1 pb-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          <>
            <SessionGroup label="Today" sessions={grouped.today} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onRenameSession={onRenameSession} onDeleteSession={onDeleteSession} />
            <SessionGroup label="Yesterday" sessions={grouped.yesterday} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onRenameSession={onRenameSession} onDeleteSession={onDeleteSession} />
            <SessionGroup label="This Week" sessions={grouped.thisWeek} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onRenameSession={onRenameSession} onDeleteSession={onDeleteSession} />
            <SessionGroup label="Older" sessions={grouped.older} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onRenameSession={onRenameSession} onDeleteSession={onDeleteSession} />
          </>
        )}
      </div>
    </div>
  );
}