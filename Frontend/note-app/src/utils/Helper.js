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

// Available aesthetic note color themes (Light / Dark mode tuned)
export const NOTE_COLORS = [
  {
    id: "default",
    name: "Classic",
    bgClass: "bg-white",
    borderClass: "border-slate-200/80",
    hoverBorder: "hover:border-slate-300",
    badgeBg: "bg-slate-100 text-slate-600",
    dotColor: "bg-slate-400",
  },
  {
    id: "amber",
    name: "Amber",
    bgClass: "bg-amber-50/80",
    borderClass: "border-amber-200/70",
    hoverBorder: "hover:border-amber-300",
    badgeBg: "bg-amber-100/80 text-amber-700",
    dotColor: "bg-amber-400",
  },
  {
    id: "emerald",
    name: "Emerald",
    bgClass: "bg-emerald-50/80",
    borderClass: "border-emerald-200/70",
    hoverBorder: "hover:border-emerald-300",
    badgeBg: "bg-emerald-100/80 text-emerald-700",
    dotColor: "bg-emerald-400",
  },
  {
    id: "sky",
    name: "Sky",
    bgClass: "bg-sky-50/80",
    borderClass: "border-sky-200/70",
    hoverBorder: "hover:border-sky-300",
    badgeBg: "bg-sky-100/80 text-sky-700",
    dotColor: "bg-sky-400",
  },
  {
    id: "purple",
    name: "Lavender",
    bgClass: "bg-purple-50/80",
    borderClass: "border-purple-200/70",
    hoverBorder: "hover:border-purple-300",
    badgeBg: "bg-purple-100/80 text-purple-700",
    dotColor: "bg-purple-400",
  },
  {
    id: "rose",
    name: "Rose",
    bgClass: "bg-rose-50/80",
    borderClass: "border-rose-200/70",
    hoverBorder: "hover:border-rose-300",
    badgeBg: "bg-rose-100/80 text-rose-700",
    dotColor: "bg-rose-400",
  },
  {
    id: "orange",
    name: "Peach",
    bgClass: "bg-orange-50/80",
    borderClass: "border-orange-200/70",
    hoverBorder: "hover:border-orange-300",
    badgeBg: "bg-orange-100/80 text-orange-700",
    dotColor: "bg-orange-400",
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