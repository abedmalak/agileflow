/**
 * Task assignment engine that calculates suitability scores
 * for matching team members to tasks based on competency,
 * availability, and past performance.
 *
 * Suitability = w1 * Competency + w2 * Availability + w3 * Performance
 */

const DEFAULT_WEIGHTS = {
  competency: 0.4,
  availability: 0.35,
  performance: 0.25,
};

// Normalize a string for keyword comparison
function normalize(str) {
  return (str || "").toLowerCase().trim();
}

// Extract keywords from a task title or description
function extractKeywords(text) {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were",
    "to", "for", "of", "in", "on", "at", "by", "with", "from", "as",
    "it", "its", "this", "that", "be", "not", "do", "has", "have",
    "will", "can", "should", "new", "add", "create", "update", "fix",
  ]);
  return normalize(text)
    .split(/[\s\-_/.,;:!?()]+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

// Calculate competency score (0-1) by matching member skills to task keywords
function scoreCompetency(task, member, boardColumns) {
  const memberSkills = (member.skills || []).map(normalize);
  const memberRole = normalize(member.job_title || member.role || "");
  const memberDept = normalize(member.department || "");
  const memberDesc = normalize(member.description || "");

  // Build the full set of member expertise terms
  const expertise = new Set([
    ...memberSkills,
    ...memberRole.split(/\s+/),
    ...memberDept.split(/\s+/),
    ...memberDesc.split(/[\s\-_/.,;:!?()]+/).filter(w => w.length > 2),
  ]);

  // Build task requirement keywords from title + priority + any text column data
  const taskKeywords = extractKeywords(task.title || "");
  if (task.data) {
    for (const col of boardColumns || []) {
      if (col.type === "text" && task.data[col.id]) {
        taskKeywords.push(...extractKeywords(task.data[col.id]));
      }
    }
  }

  if (taskKeywords.length === 0) {
    // No keywords to match — give a baseline score based on whether they have skills listed
    return memberSkills.length > 0 ? 0.5 : 0.3;
  }

  let matches = 0;
  for (const keyword of taskKeywords) {
    for (const term of expertise) {
      if (term.includes(keyword) || keyword.includes(term)) {
        matches++;
        break;
      }
    }
  }

  return Math.min(1, matches / taskKeywords.length);
}

// Calculate availability score (0-1) — inverse of current workload
function scoreAvailability(member, allItems, boardColumns) {
  const inProgressLabels = new Set(["in progress", "working on it", "working", "active"]);
  let activeCount = 0;

  for (const item of allItems) {
    if (!item.data) continue;

    // Check if this item is assigned to the member
    let assigned = false;
    let isActive = false;

    for (const col of boardColumns) {
      const val = item.data[col.id];
      if (!val) continue;

      if (col.type === "person" && val === member.id) {
        assigned = true;
      }
      if (col.type === "status" && inProgressLabels.has(normalize(val))) {
        isActive = true;
      }
    }

    if (assigned && isActive) {
      activeCount++;
    }
  }

  // Score drops as workload increases: 0 tasks = 1.0, 5+ tasks = ~0.17
  return 1 / (1 + activeCount);
}

// Calculate performance score (0-1) — completion ratio of assigned tasks
function scorePerformance(member, allItems, boardColumns) {
  const doneLabels = new Set(["done", "complete", "completed", "closed", "resolved"]);
  let assigned = 0;
  let completed = 0;

  for (const item of allItems) {
    if (!item.data) continue;

    let isAssigned = false;
    let isDone = false;

    for (const col of boardColumns) {
      const val = item.data[col.id];
      if (!val) continue;

      if (col.type === "person" && val === member.id) {
        isAssigned = true;
      }
      if (col.type === "status" && doneLabels.has(normalize(val))) {
        isDone = true;
      }
    }

    if (isAssigned) {
      assigned++;
      if (isDone) completed++;
    }
  }

  if (assigned === 0) return 0.5; // No track record — neutral score
  return completed / assigned;
}

/**
 * Calculate suitability score for assigning a task to a specific member.
 * Returns a score between 0 and 1, plus individual component scores.
 */
export function calculateSuitability(
  task,
  member,
  allItems,
  boardColumns = [],
  weights = DEFAULT_WEIGHTS
) {
  const competency = scoreCompetency(task, member, boardColumns);
  const availability = scoreAvailability(member, allItems, boardColumns);
  const performance = scorePerformance(member, allItems, boardColumns);

  const score =
    weights.competency * competency +
    weights.availability * availability +
    weights.performance * performance;

  return {
    score: Math.round(score * 100) / 100,
    competency: Math.round(competency * 100) / 100,
    availability: Math.round(availability * 100) / 100,
    performance: Math.round(performance * 100) / 100,
  };
}

/**
 * Suggest the best assignees for a task, ranked by suitability score.
 * Returns an array sorted by score (highest first) with reasoning.
 */
export function suggestAssignees(task, members, allItems, boardColumns, weights) {
  if (!members || members.length === 0) return [];

  const suggestions = members.map(member => {
    const result = calculateSuitability(task, member, allItems, boardColumns, weights);

    // Build a short reasoning string
    const reasons = [];
    if (result.competency >= 0.7) reasons.push("strong skill match");
    else if (result.competency >= 0.4) reasons.push("partial skill match");
    else reasons.push("limited skill overlap");

    if (result.availability >= 0.8) reasons.push("low workload");
    else if (result.availability >= 0.5) reasons.push("moderate workload");
    else reasons.push("high workload");

    if (result.performance >= 0.8) reasons.push("high completion rate");
    else if (result.performance >= 0.5) reasons.push("average completion rate");

    return {
      member: {
        id: member.id,
        name: member.full_name || member.email,
        role: member.job_title || member.role,
        skills: member.skills || [],
      },
      ...result,
      reasoning: reasons.join(", "),
    };
  });

  return suggestions.sort((a, b) => b.score - a.score);
}

/**
 * Suggest which backlog stories to include in a sprint based on
 * team capacity, skill coverage, and story priority.
 */
export function suggestSprintComposition(stories, members, capacity) {
  if (!stories || stories.length === 0) return { selected: [], reasoning: "No stories in backlog" };

  const maxPoints = capacity || 40;

  // Priority weights for sorting
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

  // Score and sort stories
  const scored = stories.map(story => {
    const points = story.story_points || story.points || 3;
    const priority = normalize(story.priority || "medium");
    const priorityWeight = priorityOrder[priority] || 2;

    // Check if any team member has skills matching this story
    let skillCoverage = 0;
    if (members && members.length > 0) {
      const storyKeywords = extractKeywords(story.title || "");
      for (const member of members) {
        const memberSkills = (member.skills || []).map(normalize);
        const hasMatch = storyKeywords.some(kw =>
          memberSkills.some(sk => sk.includes(kw) || kw.includes(sk))
        );
        if (hasMatch) {
          skillCoverage = 1;
          break;
        }
      }
    } else {
      skillCoverage = 0.5;
    }

    return {
      story,
      points,
      priorityWeight,
      skillCoverage,
      sortScore: priorityWeight * 2 + skillCoverage,
    };
  });

  scored.sort((a, b) => b.sortScore - a.sortScore);

  // Greedy selection up to capacity
  const selected = [];
  let usedPoints = 0;

  for (const item of scored) {
    if (usedPoints + item.points <= maxPoints) {
      selected.push({
        id: item.story.id,
        title: item.story.title,
        points: item.points,
        priority: item.story.priority || "Medium",
        hasSkillCoverage: item.skillCoverage > 0,
      });
      usedPoints += item.points;
    }
  }

  const reasoning = [
    `Selected ${selected.length} stories totaling ${usedPoints} points out of ${maxPoints} capacity.`,
    `Stories prioritized by urgency and team skill coverage.`,
    selected.length < scored.length
      ? `${scored.length - selected.length} stories deferred due to capacity constraints.`
      : "All backlog stories fit within sprint capacity.",
  ].join(" ");

  return {
    selected,
    totalPoints: usedPoints,
    capacity: maxPoints,
    reasoning,
  };
}
