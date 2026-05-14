import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, X, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/api/entities/User";
import { Board } from "@/api/entities/Board";
import { TeamMember } from "@/api/entities/TeamMember";

export default function InviteTeamModal({
  isOpen,
  onClose,
  boardId = '',
  lockBoardSelection = false,
  onInvitesSent,
}) {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedBoardId(boardId || '');
      loadBoards();
      setResults([]);
    }
  }, [isOpen, boardId]);

  const loadBoards = async () => {
    try {
      const data = await Board.list();
      setBoards(data || []);
      if (boardId) {
        setSelectedBoardId(boardId);
      } else if (data?.length > 0) {
        setSelectedBoardId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
    }
  };

  const addEmail = () => {
    const trimmed = currentEmail.trim().toLowerCase();
    if (trimmed && trimmed.includes('@') && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setCurrentEmail('');
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSendInvites = async () => {
    if (emails.length === 0 || !selectedBoardId) return;

    setIsLoading(true);
    const inviteResults = [];
    let existingMemberIds = new Set();

    try {
      const existingMembers = await TeamMember.listByBoard(selectedBoardId);
      existingMemberIds = new Set((existingMembers || []).map(member => member.user_id));
    } catch (error) {
      console.error('Failed to load existing team members:', error);
    }

    for (const email of emails) {
      try {
        // Look up the user by email
        const users = await User.search(email);
        const matchedUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!matchedUser) {
          inviteResults.push({ email, status: 'not_found' });
          continue;
        }

        // Check if already a team member on this board
        if (existingMemberIds.has(matchedUser.id)) {
          inviteResults.push({ email, status: 'already_member' });
          continue;
        }

        // Add as team member
        await TeamMember.add(selectedBoardId, matchedUser.id, role);
        existingMemberIds.add(matchedUser.id);
        inviteResults.push({ email, status: 'success' });
      } catch (error) {
        console.error(`Failed to invite ${email}:`, error);
        inviteResults.push({ email, status: 'error', message: error.message });
      }
    }

    setResults(inviteResults);

    const successCount = inviteResults.filter(r => r.status === 'success').length;
    const notFoundCount = inviteResults.filter(r => r.status === 'not_found').length;

    if (successCount > 0) {
      toast({
        title: `${successCount} member${successCount > 1 ? 's' : ''} added`,
        description: 'They now have access to the board.',
      });
      onInvitesSent?.({
        boardId: selectedBoardId,
        addedCount: successCount,
      });
    }
    if (notFoundCount > 0) {
      toast({
        title: `${notFoundCount} email${notFoundCount > 1 ? 's' : ''} not found`,
        description: 'They need to sign up first before they can be invited.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
    // Clear only successfully added emails
    setEmails(inviteResults.filter(r => r.status !== 'success').map(r => r.email));
  };

  const handleClose = () => {
    setEmails([]);
    setCurrentEmail('');
    setRole('editor');
    setSelectedBoardId(boardId || '');
    setResults([]);
    onClose();
  };

  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full access, can manage members' },
    { value: 'editor', label: 'Editor', description: 'Can edit and create content' },
    { value: 'viewer', label: 'Viewer', description: 'Can view content only' }
  ];

  const getResultIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'not_found': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'already_member': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getResultText = (status) => {
    switch (status) {
      case 'success': return 'Added to board';
      case 'not_found': return 'No account found — they need to sign up first';
      case 'already_member': return 'Already a member of this board';
      default: return 'Failed to invite';
    }
  };

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Invite Team Members
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Board Selection */}
          {lockBoardSelection ? (
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Board</Label>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
                {selectedBoard ? `${selectedBoard.icon} ${selectedBoard.title}` : 'Loading board...'}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Select Board</Label>
              <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
                <SelectTrigger className="rounded-xl border-border h-12">
                  <SelectValue placeholder="Choose a board..." />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      <span>{board.icon} {board.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {boards.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">Create a board first to invite members.</p>
              )}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Addresses
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email address..."
                className="flex-1 rounded-xl border-border h-12 focus:ring-2 focus:ring-primary/20"
              />
              <Button
                onClick={addEmail}
                disabled={!currentEmail || !currentEmail.includes('@')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-4"
              >
                Add
              </Button>
            </div>

            {/* Email Tags */}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge className="bg-border text-foreground hover:bg-muted flex items-center gap-1 px-3 py-1">
                      <Mail className="w-3 h-3" />
                      {email}
                      <button
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Role & Permissions</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-xl border-border h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invite Results */}
          {results.length > 0 && (
            <div className="space-y-2 p-4 bg-muted rounded-xl">
              <span className="text-sm font-medium text-foreground">Results</span>
              {results.map((result) => (
                <div key={result.email} className="flex items-center gap-2 text-sm py-1">
                  {getResultIcon(result.status)}
                  <span className="font-medium text-foreground">{result.email}</span>
                  <span className="text-muted-foreground">— {getResultText(result.status)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          {emails.length > 0 && results.length === 0 && (
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Inviting {emails.length} member{emails.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                They will be added as <strong>{roleOptions.find(r => r.value === role)?.label}</strong>
                {' '}to the selected board. They must have an existing account.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-xl h-12 px-6"
          >
            {results.length > 0 ? 'Done' : 'Cancel'}
          </Button>
          {results.length === 0 && (
            <Button
              onClick={handleSendInvites}
              disabled={emails.length === 0 || !selectedBoardId || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 font-medium"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Inviting...</>
              ) : (
                `Invite ${emails.length} Member${emails.length > 1 ? 's' : ''}`
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
