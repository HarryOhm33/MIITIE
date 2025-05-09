export const notifications = [
  {
    id: 1,
    title: "Incubation Program Applications Open",
    date: "May 15, 2023",
    description:
      "Applications for our next incubation cohort are now open. Deadline for submissions is June 30.",
    isImportant: true,
    isNew: true,
    category: "program",
  },
  {
    id: 2,
    title: "Mentor Matching Session",
    date: "May 20, 2023",
    description:
      "Schedule your mentor matching session for personalized startup guidance.",
    isImportant: false,
    isNew: true,
    category: "event",
  },
  {
    id: 3,
    title: "Funding Workshop",
    date: "May 25, 2023",
    description:
      "Learn how to pitch to investors and secure funding for your startup.",
    isImportant: true,
    isNew: false,
    category: "workshop",
  },
  {
    id: 4,
    title: "Demo Day Announcement",
    date: "June 10, 2023",
    description: "Save the date for our next cohort's Demo Day presentations.",
    isImportant: false,
    isNew: false,
    category: "event",
  },
  {
    id: 5,
    title: "New Co-working Space",
    date: "June 1, 2023",
    description:
      "Our expanded co-working space is now available for all incubated startups.",
    isImportant: false,
    isNew: true,
    category: "facility",
  },
  {
    id: 6,
    title: "Investor Meetup",
    date: "June 15, 2023",
    description:
      "Opportunity to network with angel investors and venture capitalists.",
    isImportant: true,
    isNew: true,
    category: "event",
  },
];

export const categories = [
  { id: "all", name: "All Notifications" },
  { id: "program", name: "Program Updates" },
  { id: "event", name: "Events" },
  { id: "workshop", name: "Workshops" },
  { id: "facility", name: "Facility Updates" },
];
