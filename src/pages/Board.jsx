
import React, { useState, useEffect, useRef } from "react";
import { Board } from "@/api/entities/Board";
import { Item } from "@/api/entities/Item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import {
  Plus,
  Search,
  Filter,
  Users,
  ArrowLeft,
  SortAsc,
  Eye,
  EyeOff,
  Group as GroupIcon,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Calendar,
  Check
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

import BoardHeader from "../components/board/BoardHeader";
import GroupSection from "../components/board/GroupSection";
import NewTaskModal from "../components/board/NewTaskModal";
import FilterPanel from "../components/board/FilterPanel";
import SortMenu from "../components/board/SortMenu";
import PersonFilter from "../components/board/PersonFilter";
import HideMenu from "../components/board/HideMenu";
import GroupByMenu from "../components/board/GroupByMenu";
import NewColumnModal from "../components/board/NewColumnModal";
import NewGroupModal from "../components/board/NewGroupModal";
import KanbanView from "../components/board/views/KanbanView";
import CalendarView from "../components/board/views/CalendarView";
import TimelineView from "../components/board/views/TimelineView";

import AnalyticsPanel from "../components/board/analytics/AnalyticsPanel";
import { usePermissions } from "@/hooks/usePermissions";
import InfoTooltip from "../components/common/InfoTooltip";
import ModuleHelp from "../components/common/ModuleHelp";
import { AIExplainButton } from "../components/ai/AIExplainButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function UnassignedView({ board, items, onUpdateItem }) {
  const [assigningItemId, setAssigningItemId] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const dropdownRef = useRef(null);

  const personColumn = board?.columns?.find(col => col.type === 'people' || col.type === 'person');
  const statusColumn = board?.columns?.find(col => col.type === 'status');
  const priorityColumn = board?.columns?.find(col => col.type === 'priority');
  const dateColumn = board?.columns?.find(col => col.type === 'date');
  const personColId = personColumn?.id;

  const unassignedItems = items.filter(item => {
    if (!personColId) return true;
    const val = item.data?.[personColId];
    return !val || (typeof val === 'string' && val.trim() === '');
  });

  // Load team members when assignment dropdown opens
  useEffect(() => {
    if (!assigningItemId || membersLoaded) return;
    import('@/api/entities/User').then(({ User: UserApi }) => {
      UserApi.listAll()
        .then(data => { setMembers(data || []); setMembersLoaded(true); })
        .catch(() => { setMembers([]); setMembersLoaded(true); });
    });
  }, [assigningItemId, membersLoaded]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!assigningItemId) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAssigningItemId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [assigningItemId]);

  const handleAssign = async (itemId, name) => {
    if (!personColId || !name) return;
    await onUpdateItem(itemId, {
      data: {
        ...items.find(i => i.id === itemId)?.data,
        [personColId]: name
      }
    });
    setAssigningItemId(null);
  };

  const getStatusBgColor = (status) => {
    const choice = statusColumn?.options?.choices?.find(c => c.label === status);
    return choice?.color || null;
  };

  const avatarColors = [
    'bg-violet-500', 'bg-pink-500', 'bg-sky-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-indigo-500', 'bg-rose-500', 'bg-teal-500',
  ];
  const getAvatarColor = (str) => avatarColors[(str || '').charCodeAt(0) % avatarColors.length];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Unassigned Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {unassignedItems.length} {unassignedItems.length === 1 ? 'task' : 'tasks'} without an assignee
          </p>
        </div>
      </div>

      {unassignedItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <h3 className="text-lg font-medium mb-1">All tasks are assigned</h3>
          <p className="text-sm">Every task on this board has an owner.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {unassignedItems.map(item => {
            const statusVal = statusColumn ? item.data?.[statusColumn.id] : null;
            const priorityVal = priorityColumn ? item.data?.[priorityColumn.id] : null;
            const dateVal = dateColumn ? item.data?.[dateColumn.id] : null;
            const groupName = board?.groups?.find(g => g.id === item.group_id)?.title;
            const statusBg = getStatusBgColor(statusVal);

            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground truncate">{item.title}</span>
                      {groupName && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{groupName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {statusVal && (
                        <Badge
                          className={statusBg ? 'text-white' : ''}
                          style={statusBg ? { backgroundColor: statusBg } : undefined}
                          variant={statusBg ? undefined : "secondary"}
                        >
                          {statusVal}
                        </Badge>
                      )}
                      {priorityVal && (
                        <Badge variant="outline" className="text-xs capitalize">{priorityVal}</Badge>
                      )}
                      {dateVal && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(dateVal).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative shrink-0" ref={assigningItemId === item.id ? dropdownRef : null}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => setAssigningItemId(assigningItemId === item.id ? null : item.id)}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Assign
                    </Button>

                    {assigningItemId === item.id && (
                      <div className="absolute right-0 top-full mt-1 z-30 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[220px] max-h-[280px] overflow-y-auto">
                        {!membersLoaded ? (
                          <div className="px-3 py-4 text-xs text-muted-foreground text-center">Loading team...</div>
                        ) : members.length === 0 ? (
                          <div className="px-3 py-4 text-xs text-muted-foreground text-center">No team members found</div>
                        ) : (
                          members.map(m => {
                            const name = m.full_name || m.email || 'Unnamed';
                            return (
                              <button
                                key={m.id}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent transition-colors text-left"
                                onClick={() => handleAssign(item.id, name)}
                              >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${getAvatarColor(name)}`}>
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm text-foreground truncate">{m.full_name || 'Unnamed'}</div>
                                  {m.email && <div className="text-[11px] text-muted-foreground truncate">{m.email}</div>}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BoardPage() {
  const { toast } = useToast();
  const { canCreateItem, canEditItem, canDeleteItem, canDragItem, canEditBoard } = usePermissions();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get('id');

  const [board, setBoard] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentView, setCurrentView] = useState('table');
  
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showPersonFilter, setShowPersonFilter] = useState(false);
  const [showHideMenu, setShowHideMenu] = useState(false);
  const [showGroupByMenu, setShowGroupByMenu] = useState(false);
  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(false);

  
  const [filters, setFilters] = useState({
    status: [],
    people: [],
    priority: []
  });
  const [sortBy, setSortBy] = useState('order_index');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hiddenColumns, setHiddenColumns] = useState(new Set());
  const [groupBy, setGroupBy] = useState('group');

  useEffect(() => {
    if (boardId) {
      loadBoardAndItems();
    }
  }, [boardId]);

  const loadBoardAndItems = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const boardDataPromise = Board.filter({ id: boardId });
      const itemsDataPromise = Item.filter({ board_id: boardId }, "order_index");

      const [boardResponse, itemsData] = await Promise.all([boardDataPromise, itemsDataPromise]);

      if (boardResponse.length > 0) {
        setBoard(boardResponse[0]);
      } else {
        setBoard(null);
      }
      setItems(itemsData);
    } catch (error) {
      console.error("Error loading board and items:", error);
      setBoard(null);
      setLoadError(true);
    }
    setIsLoading(false);
  };

  const handleAddItem = async (groupId, title) => {
    if (!boardId || !board) return;

    const maxOrder = Math.max(
      0,
      ...items.filter(item => item.group_id === groupId).map(item => item.order_index || 0)
    );

    const newItemData = {};
    if (board.columns) {
      board.columns.forEach(column => {
        if (column.id === 'task') return;

        switch (column.type) {
          case 'text':
            newItemData[column.id] = "";
            break;
          case 'status':
            newItemData[column.id] = column.options?.choices?.[0]?.label || null;
            break;
          case 'date':
            newItemData[column.id] = null;
            break;
          case 'people':
            newItemData[column.id] = null;
            break;
          case 'number':
            newItemData[column.id] = null;
            break;
          case 'tags':
            newItemData[column.id] = [];
            break;
          case 'checkbox':
            newItemData[column.id] = false;
            break;
          case 'dropdown':
            newItemData[column.id] = column.options?.choices?.[0]?.value || null;
            break;
          case 'priority':
             newItemData[column.id] = column.options?.choices?.[0]?.value || null;
            break;
          default:
            newItemData[column.id] = null;
        }
      });
    }
    
    try {
      const newItem = await Item.create({
        board_id: boardId,
        group_id: groupId,
        title: title,
        order_index: maxOrder + 1,
        data: newItemData
      });
      setItems(prev => [...prev, newItem].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
    } catch (error) {
      console.error("Error adding item:", error);
      showErrorToast(toast, "Error adding task", error);
    }
  };

  const handleUpdateItem = async (itemId, updates) => {
    try {
      await Item.update(itemId, updates);
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));
      if (showAnalytics) {
        loadBoardAndItems();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showErrorToast(toast, "Update failed", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await Item.delete(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      if (showAnalytics) {
        loadBoardAndItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showErrorToast(toast, "Delete failed", error);
    }
  };

  const handleReorderItems = async (groupId, sourceIndex, destinationIndex) => {
    const groupItems = items.filter(item => item.group_id === groupId).sort((a,b) => (a.order_index || 0) - (b.order_index || 0));
    
    if (sourceIndex < 0 || sourceIndex >= groupItems.length ||
        destinationIndex < 0 || destinationIndex >= groupItems.length) {
      console.warn("Invalid indices for reordering items.");
      return;
    }

    const [reorderedItem] = groupItems.splice(sourceIndex, 1);
    groupItems.splice(destinationIndex, 0, reorderedItem);

    const updates = groupItems.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setItems(prev => {
      const otherItems = prev.filter(item => item.group_id !== groupId);
      return [...otherItems, ...updates].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    });

    try {
      await Promise.all(updates.map(item => 
        Item.update(item.id, { order_index: item.order_index })
      ));
    } catch (error) {
      console.error("Error reordering items:", error);
      showErrorToast(toast, "Reorder failed", error);
      loadBoardAndItems();
    }
  };

  const handleAddColumn = async (columnData) => {
    if (!board) return;
    const newColumn = { ...columnData, id: generateId(), width: columnData.width || 150 };
    const updatedColumns = [...(board.columns || []), newColumn];
    
    // Also update all groups to include the new column in their visible_columns
    const updatedGroups = (board.groups || []).map(group => {
      const currentVisibleColumns = group.visible_columns || board.columns?.map(col => col.id) || [];
      return {
        ...group,
        visible_columns: [...currentVisibleColumns, newColumn.id]
      };
    });

    try {
      await Board.update(board.id, { 
        columns: updatedColumns,
        groups: updatedGroups 
      });
      setBoard(prev => ({ 
        ...prev, 
        columns: updatedColumns,
        groups: updatedGroups 
      }));
      setShowNewColumnModal(false);
    } catch (error) {
      console.error("Error adding column:", error);
      showErrorToast(toast, "Error adding column", error);
    }
  };

  const handleUpdateColumn = async (columnId, updatedData) => {
    if (!board?.columns) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId ? { ...col, ...updatedData } : col
    );
    try {
      await Board.update(board.id, { columns: updatedColumns });
      setBoard(prev => ({ ...prev, columns: updatedColumns }));
    } catch (error) {
      console.error("Error updating column:", error);
      showErrorToast(toast, "Column update failed", error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!board?.columns) return;
    const updatedColumns = board.columns.filter(col => col.id !== columnId);
    const updatedItems = items.map(item => {
      const newData = { ...item.data };
      delete newData[columnId];
      return { ...item, data: newData };
    });

    try {
      await Board.update(board.id, { columns: updatedColumns });
      setBoard(prev => ({ ...prev, columns: updatedColumns }));
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting column:", error);
      showErrorToast(toast, "Column delete failed", error);
    }
  };
  
  const handleAddGroup = async (groupData) => {
    if (!board) return;
    const newGroup = { ...groupData, id: generateId(), collapsed: false };
    const updatedGroups = [...(board.groups || []), newGroup];
    try {
      await Board.update(board.id, { groups: updatedGroups });
      setBoard(prev => ({ ...prev, groups: updatedGroups }));
      setShowNewGroupModal(false);
    } catch (error) {
      console.error("Error adding group:", error);
      showErrorToast(toast, "Error adding group", error);
    }
  };

  const handleDeleteGroup = async (groupIdToDelete) => {
    if (!board) return;

    if (!window.confirm("Are you sure you want to delete this group and all its tasks? This action cannot be undone.")) {
      return;
    }

    const updatedGroups = (board.groups || []).filter(group => group.id !== groupIdToDelete);
    const itemsOfDeletedGroup = items.filter(item => item.group_id === groupIdToDelete);
    const itemDeletePromises = itemsOfDeletedGroup.map(item => Item.delete(item.id));

    try {
      await Board.update(board.id, { groups: updatedGroups });
      await Promise.all(itemDeletePromises);
      setBoard(prevBoard => ({ ...prevBoard, groups: updatedGroups }));
      setItems(prevItems => prevItems.filter(item => item.group_id !== groupIdToDelete));
    } catch (error) {
      console.error("Error deleting group:", error);
      showErrorToast(toast, "Group delete failed", error);
      loadBoardAndItems();
    }
  };

  const handleHideColumnFromGroup = async (groupId, columnId) => {
    if (!board) return;
    
    const updatedGroups = (board.groups || []).map(group => {
      if (group.id === groupId) {
        const currentVisibleColumns = group.visible_columns || (board.columns || []).map(col => col.id);
        const newVisibleColumns = currentVisibleColumns.filter(id => id !== columnId);
        return { ...group, visible_columns: newVisibleColumns };
      }
      return group;
    });

    try {
      await Board.update(board.id, { groups: updatedGroups });
      setBoard(prev => ({ ...prev, groups: updatedGroups }));
    } catch (error) {
      console.error("Error hiding column from group:", error);
      showErrorToast(toast, "Error hiding column", error);
    }
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  const filteredItems = items.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(item.data?.status)) {
      return false;
    }
    if (filters.people.length > 0 && !filters.people.includes(item.data?.owner)) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(item.data?.priority)) {
      return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue = a[sortBy] || a.data?.[sortBy] || '';
    let bValue = b[sortBy] || b.data?.[sortBy] || '';
    
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    if (sortDirection === 'desc') {
      [aValue, bValue] = [bValue, aValue];
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
    } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });

  const groupedItems = board?.groups?.reduce((acc, group) => {
    acc[group.id] = sortedItems.filter(item => item.group_id === group.id);
    return acc;
  }, {}) || {};

  // Ensure task column always exists so titles are visible
  const boardColumns = board?.columns || [];
  const hasTaskColumn = boardColumns.some(col => col.id === 'task');
  const allColumns = hasTaskColumn
    ? boardColumns
    : [{ id: 'task', title: 'Task', type: 'task', width: 250 }, ...boardColumns];
  const visibleColumns = allColumns.filter(col => !hiddenColumns?.has(col.id));

  if (isLoading) {
    return (
      <div className="p-8 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Failed to load board</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching this board.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadBoardAndItems}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            <Link to={createPageUrl("Boards")}>
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Board not found</h2>
            <Link to={createPageUrl("Boards")}>
              <Button variant="default">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSelectedCount = selectedItems?.size || 0;
  const numHiddenColumns = hiddenColumns?.size || 0;

  return (
    <TooltipProvider delayDuration={200}>
    <div className="bg-background min-h-screen">
      <div className="max-w-full">
        <div className="sticky top-0 z-20 bg-background pb-4">
          <BoardHeader
            board={board}
            items={items}
            itemsCount={items.length}
            selectedCount={currentSelectedCount}
            currentView={currentView}
            onViewChange={handleViewChange}
            onShowAnalytics={() => setShowAnalytics(true)}
            onUpdateBoard={async (updates) => {
              try {
                const updated = await Board.update(boardId, updates);
                setBoard(updated);
              } catch (error) {
                console.error("Error updating board:", error);
                showErrorToast(toast, "Board update failed", error);
              }
            }}
          />
        </div>

        <div className="px-6 py-6">
          {currentView === 'table' && (
            <div className="flex items-center justify-between mb-6 bg-card rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowNewTaskModal(true)}
                      className="rounded-lg h-10 px-4 font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Create a new task in this board. You can assign it to a group after creation.</TooltipContent>
                </Tooltip>

                <div className="relative flex items-center gap-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 rounded-lg h-10"
                  />
                  <InfoTooltip text="Search tasks by title — results update as you type" side="bottom" size="xs" />
                </div>

                <div className="relative flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 px-4"
                        onClick={() => setShowPersonFilter(!showPersonFilter)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Person
                        {filters.people.length > 0 && (
                          <Badge className="ml-2 rounded-full w-5 h-5 text-xs p-0 flex items-center justify-center">
                            {filters.people.length}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Show only tasks assigned to a specific team member. The badge shows how many filters are active.</TooltipContent>
                  </Tooltip>
                  {showPersonFilter && (
                    <PersonFilter
                      items={items}
                      selectedPeople={filters.people}
                      onChange={(people) => setFilters(prev => ({ ...prev, people }))}
                      onClose={() => setShowPersonFilter(false)}
                    />
                  )}
                </div>

                <div className="relative flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 px-4"
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                        {(filters.status.length + (filters.priority?.length || 0)) > 0 && (
                          <Badge className="ml-2 rounded-full w-5 h-5 text-xs p-0 flex items-center justify-center">
                            {filters.status.length + (filters.priority?.length || 0)}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Narrow down tasks by status, priority, date, or other columns. Combine multiple filters.</TooltipContent>
                  </Tooltip>
                  {showFilterPanel && (
                    <FilterPanel
                      filters={filters}
                      onChange={setFilters}
                      onClose={() => setShowFilterPanel(false)}
                      board={board}
                    />
                  )}
                </div>

                <div className="relative flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 px-4"
                        onClick={() => setShowSortMenu(!showSortMenu)}
                      >
                        <SortAsc className="w-4 h-4 mr-2" />
                        Sort
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Reorder tasks by any column. Click again to reverse the direction (ascending / descending).</TooltipContent>
                  </Tooltip>
                  {showSortMenu && (
                    <SortMenu
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      columns={board.columns}
                      onChange={(field, direction) => {
                        setSortBy(field);
                        setSortDirection(direction);
                      }}
                      onClose={() => setShowSortMenu(false)}
                    />
                  )}
                </div>

                <div className="relative flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 px-4"
                        onClick={() => setShowHideMenu(!showHideMenu)}
                      >
                        {numHiddenColumns > 0 ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        Hide
                        {numHiddenColumns > 0 && (
                          <Badge className="ml-2 rounded-full w-5 h-5 text-xs p-0 flex items-center justify-center">
                            {numHiddenColumns}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Toggle which columns are visible. Hidden columns still store data — they are just not shown.</TooltipContent>
                  </Tooltip>
                  {showHideMenu && (
                    <HideMenu
                      columns={board.columns}
                      hiddenColumns={hiddenColumns}
                      onChange={setHiddenColumns}
                      onClose={() => setShowHideMenu(false)}
                    />
                  )}
                </div>

                <div className="relative flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 px-4"
                        onClick={() => setShowGroupByMenu(!showGroupByMenu)}
                      >
                        <GroupIcon className="w-4 h-4 mr-2" />
                        Group by
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Reorganize tasks into groups based on a column. For example, group by Status to see all &quot;Done&quot; tasks together.</TooltipContent>
                  </Tooltip>
                  {showGroupByMenu && (
                    <GroupByMenu
                      groupBy={groupBy}
                      columns={board.columns}
                      onChange={setGroupBy}
                      onClose={() => setShowGroupByMenu(false)}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ModuleHelp moduleKey="board" />
                <AIExplainButton
                  widgetTitle="Board Overview"
                  widgetData={{
                    boardTitle: board.title,
                    totalItems: filteredItems.length,
                    groupCount: (board.groups || []).length,
                  }}
                />
              </div>
            </div>
          )}

          {currentView === 'table' && (
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              {board.groups?.map((group) => (
                <GroupSection
                  key={group.id}
                  group={group}
                  items={groupedItems[group.id] || []}
                  columns={visibleColumns}
                  onAddItem={canCreateItem ? handleAddItem : undefined}
                  onUpdateItem={canEditItem ? handleUpdateItem : undefined}
                  onDeleteItem={canDeleteItem ? handleDeleteItem : undefined}
                  onReorderItems={canDragItem ? handleReorderItems : undefined}
                  onUpdateColumn={canEditBoard ? handleUpdateColumn : undefined}
                  onDeleteColumn={canEditBoard ? handleDeleteColumn : undefined}
                  onAddColumn={canEditBoard ? () => setShowNewColumnModal(true) : undefined}
                  readOnly={!canEditItem}
                  isLoading={isLoading && items.length === 0}
                  selectedItems={selectedItems}
                  onSelectItem={(itemId, selected) => {
                    const newSelected = new Set(selectedItems || []);
                    if (selected) {
                      newSelected.add(itemId);
                    } else {
                      newSelected.delete(itemId);
                    }
                    setSelectedItems(newSelected);
                  }}
                  onDeleteGroup={handleDeleteGroup}
                  onHideColumnFromGroup={handleHideColumnFromGroup}
                />
              ))}
              {(!board.groups || board.groups.length === 0) && !isLoading && (
                <div className="p-8 text-center text-muted-foreground">
                  <h3 className="text-xl font-medium mb-2">No groups yet!</h3>
                  <p className="mb-4">Start by adding your first group to organize your tasks.</p>
                  {canEditBoard && (
                    <Button
                      className="rounded-lg h-10 px-4 font-medium"
                      onClick={() => setShowNewGroupModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Group
                    </Button>
                  )}
                </div>
              )}

              <div className="p-4 border-t border-border">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-dashed rounded-lg h-10"
                      onClick={() => setShowNewGroupModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Group
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Create a new section to organize related tasks. Groups are like folders within your board.</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {currentView === 'kanban' && (
            <KanbanView
              board={board}
              items={sortedItems}
              isLoading={isLoading}
              onAddItem={canCreateItem ? handleAddItem : undefined}
              onUpdateItem={canEditItem ? handleUpdateItem : undefined}
              onDeleteItem={canDeleteItem ? handleDeleteItem : undefined}
              onReorderItems={canDragItem ? handleReorderItems : undefined}
              readOnly={!canEditItem}
              onUpdateBoard={canEditBoard ? async (updates) => {
                try {
                  const updated = await Board.update(board.id, updates);
                  setBoard(updated);
                } catch (error) {
                  console.error("Error updating board:", error);
                }
              } : undefined}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              board={board}
              items={sortedItems}
              onAddItem={canCreateItem ? handleAddItem : undefined}
              onUpdateItem={canEditItem ? handleUpdateItem : undefined}
              onDeleteItem={canDeleteItem ? handleDeleteItem : undefined}
            />
          )}

          {currentView === 'timeline' && (
            <TimelineView
              board={board}
              items={sortedItems}
              onAddItem={canCreateItem ? handleAddItem : undefined}
              onUpdateItem={canEditItem ? handleUpdateItem : undefined}
              onDeleteItem={canDeleteItem ? handleDeleteItem : undefined}
            />
          )}

          {currentView === 'unassigned' && (
            <UnassignedView
              board={board}
              items={sortedItems}
              onUpdateItem={handleUpdateItem}
            />
          )}
        </div>

        <NewTaskModal
          isOpen={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          board={board}
          onSubmit={handleAddItem}
        />
        <NewColumnModal
          isOpen={showNewColumnModal}
          onClose={() => setShowNewColumnModal(false)}
          onSubmit={handleAddColumn}
        />
        <NewGroupModal
          isOpen={showNewGroupModal}
          onClose={() => setShowNewGroupModal(false)}
          onSubmit={handleAddGroup}
        />

        {showAnalytics && (
          <AnalyticsPanel 
            board={board} 
            items={items} // Pass original items, panel will sort/filter if needed
            onClose={() => setShowAnalytics(false)} 
          />
        )}

      </div>
    </div>
    </TooltipProvider>
  );
}
