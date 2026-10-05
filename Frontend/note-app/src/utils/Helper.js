export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getInitials = (name) => {
  if (!name) return "U";

  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i] && words[i][0]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase() || "U";
};

// Eye-comfort aesthetic note color themes (paper-inspired pastel palette)
export const NOTE_COLORS = [
  {
    id: "default",
    name: "Classic",
    bgClass: "bg-white",
    borderClass: "border-slate-200/75",
    cardShadow: "shadow-[0_1px_3px_rgba(15,23,42,0.03)]",
    badgeBg: "bg-slate-100/90 text-slate-600 border border-slate-200/50",
    dotColor: "bg-slate-300",
    accentColor: "text-slate-700",
  },
  {
    id: "amber",
    name: "Honey Warm",
    bgClass: "bg-amber-50/50",
    borderClass: "border-amber-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(217,119,6,0.03)]",
    badgeBg: "bg-amber-100/70 text-amber-800 border border-amber-200/50",
    dotColor: "bg-amber-300",
    accentColor: "text-amber-800",
  },
  {
    id: "emerald",
    name: "Soft Sage",
    bgClass: "bg-emerald-50/50",
    borderClass: "border-emerald-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(5,150,105,0.03)]",
    badgeBg: "bg-emerald-100/70 text-emerald-800 border border-emerald-200/50",
    dotColor: "bg-emerald-300",
    accentColor: "text-emerald-800",
  },
  {
    id: "sky",
    name: "Calm Sky",
    bgClass: "bg-sky-50/50",
    borderClass: "border-sky-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(2,132,199,0.03)]",
    badgeBg: "bg-sky-100/70 text-sky-800 border border-sky-200/50",
    dotColor: "bg-sky-300",
    accentColor: "text-sky-800",
  },
  {
    id: "purple",
    name: "Lavender",
    bgClass: "bg-purple-50/50",
    borderClass: "border-purple-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(147,51,234,0.03)]",
    badgeBg: "bg-purple-100/70 text-purple-800 border border-purple-200/50",
    dotColor: "bg-purple-300",
    accentColor: "text-purple-800",
  },
  {
    id: "rose",
    name: "Blush Rose",
    bgClass: "bg-rose-50/50",
    borderClass: "border-rose-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(225,29,72,0.03)]",
    badgeBg: "bg-rose-100/70 text-rose-800 border border-rose-200/50",
    dotColor: "bg-rose-300",
    accentColor: "text-rose-800",
  },
  {
    id: "orange",
    name: "Warm Peach",
    bgClass: "bg-orange-50/50",
    borderClass: "border-orange-200/60",
    cardShadow: "shadow-[0_1px_3px_rgba(234,88,12,0.03)]",
    badgeBg: "bg-orange-100/70 text-orange-800 border border-orange-200/50",
    dotColor: "bg-orange-300",
    accentColor: "text-orange-800",
  },
];

export const getNoteColorConfig = (colorId) => {
  return NOTE_COLORS.find((c) => c.id === colorId) || NOTE_COLORS[0];
};

// Word and character stats
export const getNoteStats = (text = "") => {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const chars = clean.length;
  const readTimeMin = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readTimeMin };
};

// Starter templates for instant note creation
export const NOTE_TEMPLATES = [
  {
    title: "Weekly Action Items",
    category: "Productivity",
    color: "emerald",
    tags: ["todo", "weekly", "goals"],
    content: `### High Priority Tasks\n- [ ] Finalize project milestone review\n- [ ] Respond to urgent stakeholder emails\n\n### Medium Priority\n- [ ] Clean up desk & digital workspace\n- [ ] Schedule team catch-up\n\n### Ideas & Backlog\n- Explore new UI redesign ideas\n- Read 1 chapter of product book`,
  },
  {
    title: "Meeting Notes & Decisions",
    category: "Work",
    color: "sky",
    tags: ["work", "meeting", "sync"],
    content: `**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** Alex, Sarah, Jay\n\n### Agenda\n1. Review sprint deliverables\n2. Discuss architectural upgrades\n\n### Key Decisions\n- Adopt enhanced UI/UX styling\n- Streamline note filtering and tagging\n\n### Next Steps\n- [ ] Follow up on deployment checklist`,
  },
  {
    title: "Product Brainstorming 💡",
    category: "Ideas",
    color: "amber",
    tags: ["ideas", "brainstorm", "creativity"],
    content: `### The Problem\nUsers need a lightning-fast, visually pleasant place to organize ideas without friction.\n\n### The Solution\n- Real-time debounced search\n- Visual color-coded notes\n- Tag filtering chips\n- Dark mode support\n\n### Why it matters\nDelightful UX makes users return every single day.`,
  },
  {
    title: "Daily Journal & Gratitude",
    category: "Personal",
    color: "purple",
    tags: ["personal", "journal", "mindset"],
    content: `### 3 Things I'm Grateful For Today:\n1. Fresh morning coffee & quiet moments\n2. Meaningful progress on creative work\n3. Supportive friends and peers\n\n### Today's Focus:\nStay present, be intentional, and celebrate small wins.\n\n### Reflection:\nWhat made today special?`,
  },
];