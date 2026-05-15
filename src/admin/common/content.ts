export const brandContent = {
  name: 'KidDo',
  adminLabel: 'Admin Console',
  heroKicker: 'Family productivity with game energy',
  heroTitle: 'KidDo turns chores, learning, and rewards into a system kids actually want to use.',
  heroText:
    'Parents get clear oversight. Children get playful missions, points, streaks, and progress. Administrators get a clean control center for analytics and moderation.',
};

export const marketingContent = {
  stats: [
    { value: '3 roles', label: 'Admin, parent, child' },
    { value: 'Realtime', label: 'Socket-based family activity' },
    { value: 'Rewards', label: 'Streaks, points, unlocks' },
  ],
  parentFeatures: [
    'Create and approve tasks in seconds',
    'Track points, streaks, and child progress',
    'Manage rewards and family accounts',
    'Get notified when missions are completed',
  ],
  childFeatures: [
    'Interactive mission cards with bright visuals',
    'Points, streaks, and leaderboard progression',
    'Avatar identity and unlockable rewards',
    'Mini-games with chess rewards and playful daily momentum',
  ],
  platformFeatures: [
    {
      key: 'roles',
      title: 'Role-based experiences',
      text: 'One ecosystem for parents, children, and administrators with tailored permissions.',
    },
    {
      key: 'realtime',
      title: 'Realtime family updates',
      text: 'Task completion and approvals can be reflected instantly across devices.',
    },
    {
      key: 'gamified',
      title: 'Gamified engagement',
      text: 'Leaderboards, streaks, chess rewards, and colorful mission flows keep kids motivated.',
    },
    {
      key: 'security',
      title: 'Secure admin oversight',
      text: 'A dedicated admin console supports analytics, moderation, and platform health monitoring.',
    },
  ],
  screenCards: [
    {
      key: 'child',
      label: 'KidDo',
      title: 'Child task screen',
      text: 'Bright mission cards, chess mini-games, high-contrast rewards, and instant completion actions.',
      theme: 'amber',
      rows: ['Make bed', 'Pack school bag', 'Feed the pet'],
    },
    {
      key: 'parent',
      label: 'Parent Hub',
      title: 'Parent overview',
      text: 'Fast task assignment, progress visibility, and reward planning in one place.',
      theme: 'blue',
      summary: [
        { value: '2', label: 'Kids' },
        { value: '7', label: 'Open tasks' },
        { value: '3', label: 'Pending approvals' },
      ],
    },
    {
      key: 'admin',
      label: 'Admin Console',
      title: 'Operations dashboard',
      text: 'Monitor users, engagement, task throughput, and moderation queues.',
      theme: 'panel',
    },
  ],
};
