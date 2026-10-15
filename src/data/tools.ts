export interface Tool {
  name: string;
  icon: string;
  /** Empty alt: the adjacent name is the accessible label. */
  alt: '';
  invertOnDark?: boolean;
}

export const tools: readonly Tool[] = [
  { name: 'HTML5', icon: '/assets/techicons/html5.svg', alt: '' },
  { name: 'TypeScript', icon: '/assets/techicons/typescript.svg', alt: '' },
  { name: 'React', icon: '/assets/techicons/react.svg', alt: '' },
  {
    name: 'Next.js',
    icon: '/assets/techicons/nextjs.svg',
    alt: '',
    invertOnDark: true,
  },
  { name: 'Redux', icon: '/assets/techicons/redux.svg', alt: '' },
  { name: 'TanStack Query', icon: '/assets/techicons/tanstack.svg', alt: '' },
  { name: 'GraphQL', icon: '/assets/techicons/graphql.svg', alt: '' },
  { name: 'Node.js', icon: '/assets/techicons/nodejs.svg', alt: '' },
  { name: 'Figma', icon: '/assets/techicons/figma.svg', alt: '' },
  { name: 'Tailwind CSS', icon: '/assets/techicons/tailwindcss.svg', alt: '' },
  { name: 'Bootstrap 5', icon: '/assets/techicons/bootstrap5.svg', alt: '' },
  { name: 'Git', icon: '/assets/techicons/git.svg', alt: '' },
  { name: 'Sass', icon: '/assets/techicons/sass.svg', alt: '' },
  { name: 'jQuery', icon: '/assets/techicons/jquery.svg', alt: '' },
  { name: 'Claude AI', icon: '/assets/techicons/claude.svg', alt: '' },
  { name: 'Storybook', icon: '/assets/techicons/storybook-icon.svg', alt: '' },
  { name: 'Azure', icon: '/assets/techicons/azure.svg', alt: '' },
  { name: 'FastAPI', icon: '/assets/techicons/fastapi.svg', alt: '' },
  { name: 'PostgreSQL', icon: '/assets/techicons/postgresql.svg', alt: '' },
  { name: 'MongoDB', icon: '/assets/techicons/mongodb.svg', alt: '' },
] as const;

export interface ToolGroup {
  id: string;
  heading: string;
  description: string;
  tools: readonly string[];
}

/** English copy; es/ar live in messages.ts under page.tools.group.<id>.*. */
export const toolGroups: readonly ToolGroup[] = [
  {
    id: 'languages',
    heading: 'Languages and frameworks',
    description:
      'The base of every interface I ship: semantic markup, typed components, and server and client rendering.',
    tools: ['HTML5', 'TypeScript', 'React', 'Next.js'],
  },
  {
    id: 'data',
    heading: 'Data and state',
    description:
      'Predictable state, cached server data and typed API boundaries for data-heavy dashboards.',
    tools: ['Redux', 'TanStack Query', 'GraphQL'],
  },
  {
    id: 'styling',
    heading: 'Styling and design systems',
    description: 'From design handoff to documented, reusable components.',
    tools: ['Figma', 'Tailwind CSS', 'Bootstrap 5', 'Sass', 'Storybook'],
  },
  {
    id: 'backend',
    heading: 'Backend, data and cloud',
    description: 'Used for full-stack features alongside the frontend.',
    tools: ['Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Azure'],
  },
  {
    id: 'workflow',
    heading: 'Workflow and maintenance',
    description:
      'Version control, legacy codebases and AI-assisted drafting and review.',
    tools: ['Git', 'jQuery', 'Claude AI'],
  },
];

const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

/** Groups with resolved tools; fails the build if a tool is missing or grouped twice. */
export const getToolGroups = () => {
  const grouped = toolGroups.flatMap((group) => group.tools);
  const unique = new Set(grouped);
  if (unique.size !== grouped.length || unique.size !== tools.length) {
    throw new Error('Every tool must appear in exactly one tool group.');
  }
  return toolGroups.map((group) => ({
    ...group,
    tools: group.tools.map((name) => {
      const tool = toolsByName.get(name);
      if (!tool) throw new Error(`Unknown tool in group ${group.id}: ${name}`);
      return tool;
    }),
  }));
};
