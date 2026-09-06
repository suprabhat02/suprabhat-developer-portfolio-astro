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
