import React, { useState, useRef, useEffect } from 'react';
import { invokeLLM } from "@/api/openrouter";
import { Board } from "@/api/entities/Board";
import { Item } from "@/api/entities/Item";
import { Sprint } from "@/api/entities/Sprint";
import { UserStory } from "@/api/entities/UserStory";
import { getAssignmentSuggestions, getSprintRecommendations } from "@/api/taskAssignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2, MessageCircle, Users, Calendar, BarChart3 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const QUICK_ACTIONS = [
  { label: "Suggest Assignments",    icon: Users,    command: "/assign"      },
  { label: "Sprint Recommendations", icon: Calendar, command: "/sprint"      },
  { label: "Performance Summary",    icon: BarChart3, command: "/performance" },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AgileFlow AI assistant. I can help with:\n\n- **Task assignments** — `/assign` to get AI-suggested assignments\n- **Sprint planning** — `/sprint` for capacity recommendations\n- **Performance insights** — `/performance` for a team summary\n- Or just ask me anything about project management!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState('right');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const response = await processMessage(userMessage);
      addMessage('assistant', response);
    } catch (error) {
      addMessage('assistant', getErrorMessage(error));
    }
    setIsLoading(false);
  };

  const getErrorMessage = (error) => {
    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('api key') || msg.includes('unauthorized')) {
      return 'AI features need to be configured. Check your API key.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return "Couldn't reach the AI service. Check your connection.";
    }
    if (msg.includes('all models failed')) {
      return 'AI service is temporarily unavailable. Try again in a moment.';
    }
    return `Something went wrong: ${error.message}`;
  };

  const processMessage = async (message) => {
    const lower = message.toLowerCase();

    if (lower.startsWith('/assign') || lower.includes('assign') && lower.includes('suggest')) {
      return await handleAssignCommand(message);
    }
    if (lower.startsWith('/sprint') || (lower.includes('sprint') && lower.includes('recommend'))) {
      return await handleSprintCommand();
    }
    if (lower.startsWith('/performance') || lower.includes('performance summary')) {
      return await handlePerformanceCommand();
    }

    const context = await buildContext();
    const enrichedPrompt = `${context}\n\nUser question: ${message}`;
    return await invokeLLM(enrichedPrompt);
  };

  const handleAssignCommand = async (message) => {
    try {
      const [boards, items] = await Promise.all([
        Board.list('-updated_date', 10),
        Item.list('-updated_date'),
      ]);

      if (boards.length === 0) return "No boards found. Create a board and add tasks to get assignment suggestions.";

      const taskPriority = message.toLowerCase().includes('critical') ? 'critical' :
                           message.toLowerCase().includes('high') ? 'high' :
                           message.toLowerCase().includes('low') ? 'low' : 'medium';

      const allSuggestions = boards.map(board => {
        const boardItems = items.filter(i => i.board_id === board.id);
        const suggestions = getAssignmentSuggestions(boardItems, board, taskPriority);
        return { board: board.title, suggestions };
      }).filter(b => b.suggestions.length > 0);

      if (allSuggestions.length === 0) {
        return "No team members found with task history yet. Assign some tasks to team members first, then I can recommend optimal assignments based on competency, availability, and performance.";
      }

      let result = `**AI Task Assignment Suggestions** (${taskPriority} priority)\n\n`;
      result += `*Formula: Score = 40% Competency + 30% Availability + 30% Performance*\n\n`;

      allSuggestions.forEach(({ board, suggestions }) => {
        result += `### ${board}\n\n`;
        result += '| Member | Score | Comp. | Avail. | Perf. | Load |\n';
        result += '|--------|-------|-------|--------|-------|------|\n';
        suggestions.forEach(s => {
          result += `| ${s.name} | **${(s.score * 100).toFixed(0)}%** | ${(s.competency * 100).toFixed(0)}% | ${(s.availability * 100).toFixed(0)}% | ${(s.performance * 100).toFixed(0)}% | ${s.currentLoad} |\n`;
        });
        result += '\n';
      });

      return result;
    } catch (error) {
      return `Error loading assignment data: ${error.message}`;
    }
  };

  const handleSprintCommand = async () => {
    try {
      const [stories, sprints] = await Promise.all([
        UserStory.list('-created_date', 100),
        Sprint.list('-start_date', 20),
      ]);

      const recs = getSprintRecommendations(stories, sprints);

      let result = '**Sprint Planning Recommendations**\n\n';
      result += `- **Recommended Capacity:** ${recs.recommendedCapacity} story points`;
      if (recs.avgVelocity > 0) result += ` (based on avg velocity of ${recs.avgVelocity} SP)`;
      result += '\n';
      result += `- **Recommended Stories:** ${recs.recommendedStories.length} stories (${recs.totalPoints} SP)\n`;
      result += `- **Remaining Capacity:** ${recs.remainingCapacity} SP\n\n`;

      if (recs.recommendedStories.length > 0) {
        result += '**Suggested Sprint Backlog:**\n\n';
        result += '| Priority | Story | Points |\n';
        result += '|----------|-------|--------|\n';
        recs.recommendedStories.forEach(s => {
          result += `| ${s.priority} | ${s.title} | ${s.story_points || 0} SP |\n`;
        });
      } else {
        result += 'No backlog stories available. Create user stories in the Backlog page first.';
      }

      return result;
    } catch (error) {
      return `Error loading sprint data: ${error.message}`;
    }
  };

  const handlePerformanceCommand = async () => {
    try {
      const [boards, items, sprints] = await Promise.all([
        Board.list('-updated_date'),
        Item.list('-updated_date'),
        Sprint.list('-start_date', 10),
      ]);

      const totalTasks = items.length;
      const completedTasks = items.filter(item => {
        const board = boards.find(b => b.id === item.board_id);
        const statusCol = board?.columns?.find(c => c.type === 'status');
        const status = statusCol ? item.data?.[statusCol.id] : item.data?.status;
        return ['done', 'completed'].includes(status?.toLowerCase());
      }).length;

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const completedSprints = sprints.filter(s => s.status === 'completed');
      const avgVelocity = completedSprints.length > 0
        ? Math.round(completedSprints.reduce((s, sp) => s + (sp.completed_points || 0), 0) / completedSprints.length)
        : 0;

      let result = '**Performance Summary**\n\n';
      result += `| Metric | Value |\n`;
      result += `|--------|-------|\n`;
      result += `| Total Tasks | ${totalTasks} |\n`;
      result += `| Completed | ${completedTasks} |\n`;
      result += `| Completion Rate | ${completionRate}% |\n`;
      result += `| Active Boards | ${boards.length} |\n`;
      result += `| Sprints Completed | ${completedSprints.length} |\n`;
      result += `| Avg Sprint Velocity | ${avgVelocity} SP |\n`;

      const analysisPrompt = `Given these project metrics: ${totalTasks} total tasks, ${completedTasks} completed (${completionRate}%), ${boards.length} boards, ${completedSprints.length} sprints completed with avg velocity ${avgVelocity} SP. Give 2-3 brief, actionable insights about team health and what to focus on next.`;

      try {
        const analysis = await invokeLLM(analysisPrompt);
        result += `\n**AI Insights:**\n${analysis}`;
      } catch {
        result += '\n\n*Performance insights unavailable — could not reach the AI service.*';
      }

      return result;
    } catch (error) {
      return `Error loading performance data: ${error.message}`;
    }
  };

  const buildContext = async () => {
    try {
      const [boards, items, sprints] = await Promise.all([
        Board.list('-updated_date', 5),
        Item.list('-updated_date', 20),
        Sprint.list('-start_date', 5),
      ]);

      const activeSprints = sprints.filter(s => s.status === 'active');
      return `Current project context: ${boards.length} boards, ${items.length} recent tasks, ${activeSprints.length} active sprints. Board names: ${boards.map(b => b.title).join(', ')}.`;
    } catch {
      return '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (command) => {
    setInput('');
    addMessage('user', command);
    setIsLoading(true);
    processMessage(command).then(response => {
      addMessage('assistant', response);
      setIsLoading(false);
    }).catch((error) => {
      addMessage('assistant', getErrorMessage(error));
      setIsLoading(false);
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={`fixed bottom-6 z-50 flex flex-col items-center gap-2 ${position === 'right' ? 'right-6' : 'left-6'}`}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-foreground text-background rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity duration-150 cursor-pointer"
              aria-label="Open AI Assistant"
            >
              <MessageCircle size={20} />
            </button>

            {/* Move button */}
            <button
              onClick={() => setPosition(position === 'right' ? 'left' : 'right')}
              className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={`Move to ${position === 'right' ? 'left' : 'right'}`}
            >
              {position === 'right' ? '←' : '→'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.15 }}
            className={`fixed bottom-6 z-50 w-[440px] max-w-[calc(100vw-3rem)] ${position === 'right' ? 'right-6' : 'left-6'}`}
          >
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
              {/* Header */}
              <div className="border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                  <span className="text-xs text-muted-foreground">Assignments, sprints, and insights</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-b border-border flex gap-2 overflow-x-auto">
                {QUICK_ACTIONS.map(action => (
                  <Button
                    key={action.command}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.command)}
                    disabled={isLoading}
                    className="flex-shrink-0 text-xs"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-background">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={
                        message.role === 'user'
                          ? 'max-w-[85%] bg-foreground text-background rounded-lg p-3 text-sm'
                          : 'max-w-[85%] bg-muted rounded-lg p-3 text-sm text-foreground'
                      }
                    >
                      <div className="leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                        <span className="text-sm text-muted-foreground">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything or try /assign, /sprint..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
