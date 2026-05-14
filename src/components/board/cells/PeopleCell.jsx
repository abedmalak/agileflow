import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { User as UserIcon } from "lucide-react";
import { User } from "@/api/entities/User";
import { cn } from "@/lib/utils";

const avatarColors = [
  'bg-violet-500', 'bg-pink-500', 'bg-sky-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-indigo-500', 'bg-rose-500', 'bg-teal-500',
];

function getColor(name) {
  const code = (name || '').charCodeAt(0) || 0;
  return avatarColors[code % avatarColors.length];
}

export default function PeopleCell({ value, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Load team members when dropdown opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    User.listAll()
      .then(data => setMembers(data || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Position the dropdown relative to the trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleSelect = (name) => {
    onUpdate(name);
    setIsOpen(false);
  };

  const toggle = () => setIsOpen(prev => !prev);

  const dropdown = isOpen
    ? createPortal(
        <MemberDropdown
          ref={dropdownRef}
          members={members}
          loading={loading}
          onSelect={handleSelect}
          onClear={value ? () => handleSelect('') : null}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        />,
        document.body
      )
    : null;

  if (!value) {
    return (
      <>
        <div
          ref={triggerRef}
          className="cursor-pointer text-muted-foreground hover:bg-accent hover:rounded px-2 py-1 -mx-2 -my-1 transition-colors flex items-center gap-2"
          onClick={toggle}
        >
          <UserIcon className="w-4 h-4" />
          <span>Assign</span>
        </div>
        {dropdown}
      </>
    );
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
        onClick={toggle}
      >
        <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0', getColor(value))}>
          {value.charAt(0).toUpperCase()}
        </div>
        <span className="text-foreground text-xs truncate">{value}</span>
      </div>
      {dropdown}
    </>
  );
}

const MemberDropdown = React.forwardRef(function MemberDropdown({ members, loading, onSelect, onClear, style }, ref) {
  return (
    <div
      ref={ref}
      className="fixed z-[100] bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[220px] max-h-[280px] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-100"
      style={style}
    >
      {loading ? (
        <div className="px-3 py-4 text-xs text-muted-foreground text-center">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="px-3 py-4 text-xs text-muted-foreground text-center">No team members found</div>
      ) : (
        <>
          {members.map(m => (
            <button
              key={m.id}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent transition-colors text-left cursor-pointer"
              onClick={() => onSelect(m.full_name || m.email)}
            >
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0', getColor(m.full_name || m.email))}>
                {(m.full_name || m.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-foreground truncate">{m.full_name || 'Unnamed'}</div>
                {m.email && <div className="text-[11px] text-muted-foreground truncate">{m.email}</div>}
              </div>
            </button>
          ))}
          {onClear && (
            <>
              <div className="border-t border-border my-1" />
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent transition-colors text-left text-sm text-muted-foreground cursor-pointer"
                onClick={onClear}
              >
                <UserIcon className="w-4 h-4" />
                Unassign
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
});
