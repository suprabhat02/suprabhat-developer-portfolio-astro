export interface Tool {
  name: string;
  icon: string;
  /** Empty alt: the adjacent name is the accessible label. */
  alt: '';
  invertOnDark?: boolean;
}

export const tools: readonly Tool[] = [
  { name: 'HTML5', icon: '/assets/techicons/html5.svg', alt: '' },
  { name: 'CSS3', icon: '/assets/techicons/css3.svg', alt: '' },
  { name: 'TypeScript', icon: '/assets/techicons/typescript.svg', alt: '' },
  { name: 'React', icon: '/assets/techicons/react.svg', alt: '' },
  {
    name: 'Astro',
    icon: '/assets/techicons/astro.svg',
    alt: '',
    invertOnDark: true,
  },
  {
    name: 'GitHub Actions',
    icon: '/assets/techicons/githubactions.svg',
    alt: '',
  },
  {
    name: 'shadcn/ui',
    icon: '/assets/techicons/shadcnui.svg',
    alt: '',
    invertOnDark: true,
  },
  {
    name: 'Zod',
    icon: '/assets/techicons/zod.svg',
    alt: '',
    invertOnDark: true,
  },
  {
    name: 'Next.js',
    icon: '/assets/techicons/nextjs.svg',
    alt: '',
    invertOnDark: true,
  },
  { name: 'Redux', icon: '/assets/techicons/redux.svg', alt: '' },
  { name: 'Zustand', icon: '/assets/techicons/zustand.webp', alt: '' },
  { name: 'TanStack Query', icon: '/assets/techicons/tanstack.svg', alt: '' },
  { name: 'GraphQL', icon: '/assets/techicons/graphql.svg', alt: '' },
  { name: 'Node.js', icon: '/assets/techicons/nodejs.svg', alt: '' },
  { name: 'Figma', icon: '/assets/techicons/figma.svg', alt: '' },
  { name: 'Tailwind CSS', icon: '/assets/techicons/tailwindcss.svg', alt: '' },
  { name: 'Bootstrap 5', icon: '/assets/techicons/bootstrap5.svg', alt: '' },
  { name: 'Ant Design', icon: '/assets/techicons/antdesign.svg', alt: '' },
  { name: 'Material UI', icon: '/assets/techicons/materialui.svg', alt: '' },
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

export type ToolGroupId =
  'languages' | 'data' | 'styling' | 'backend' | 'design' | 'workflow';

export interface ToolGroup {
  id: ToolGroupId;
  tools: readonly string[];
}

/** Headings and descriptions live in messages.ts under page.tools.group.<id>.*. */
export const toolGroups: readonly ToolGroup[] = [
  {
    id: 'languages',
    tools: ['HTML5', 'TypeScript', 'React', 'Next.js', 'Astro', 'jQuery'],
  },
  {
    id: 'data',
    tools: ['Redux', 'Zustand', 'TanStack Query', 'GraphQL', 'Zod'],
  },
  {
    id: 'styling',
    tools: [
      'CSS3',
      'Tailwind CSS',
      'Bootstrap 5',
      'Ant Design',
      'Material UI',
      'Sass',
      'shadcn/ui',
    ],
  },
  {
    id: 'backend',
    tools: ['Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB'],
  },
  { id: 'design', tools: ['Figma', 'Storybook'] },
  { id: 'workflow', tools: ['Git', 'GitHub Actions', 'Azure', 'Claude AI'] },
];

const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

const skillLogos: readonly [RegExp, string][] = [
  [/\bReact\b(?! Bootstrap)/, 'React'],
  [/Next\.js/, 'Next.js'],
  [/TypeScript/, 'TypeScript'],
  [/HTML5/, 'HTML5'],
  [/CSS3/, 'CSS3'],
  [/Sass/, 'Sass'],
  [/Tailwind/, 'Tailwind CSS'],
  [/Bootstrap/, 'Bootstrap 5'],
  [/Ant Design/, 'Ant Design'],
  [/Material UI/, 'Material UI'],
  [/Zustand/, 'Zustand'],
  [/\bGit\b/, 'Git'],
  [/Redux/, 'Redux'],
  [/TanStack/, 'TanStack Query'],
  [/GraphQL/, 'GraphQL'],
  [/MongoDB/, 'MongoDB'],
  [/FastAPI/, 'FastAPI'],
  [/PostgreSQL/, 'PostgreSQL'],
  [/Node\.js/, 'Node.js'],
  [/Astro/, 'Astro'],
  [/GitHub Actions/, 'GitHub Actions'],
  [/shadcn\/ui/, 'shadcn/ui'],
  [/Zod/, 'Zod'],
  [/jQuery/, 'jQuery'],
  [/Figma/, 'Figma'],
  [/Storybook/, 'Storybook'],
  [/Azure/, 'Azure'],
  [/Claude AI/, 'Claude AI'],
];

export const getSkillLogos = (item: string) =>
  skillLogos
    .map(([pattern, name]) => ({
      index: item.search(pattern),
      tool: toolsByName.get(name),
    }))
    .filter(
      (match): match is { index: number; tool: Tool } =>
        match.index >= 0 && match.tool !== undefined,
    )
    .sort((first, second) => first.index - second.index)
    .slice(0, 2)
    .map(({ tool }) => ({
      src: tool.icon,
      invert: tool.invertOnDark === true,
    }));

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
