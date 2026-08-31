export interface Tool {
  name: string;
  icon: string;
  /** Empty alt: the adjacent name is the accessible label. */
  alt: '';
  invertOnDark?: boolean;
}

export const tools: readonly Tool[] = [
  { name: 'TypeScript', icon: '/assets/techicons/typescript.svg', alt: '' },
  { name: 'React', icon: '/assets/techicons/react.svg', alt: '' },
  {
    name: 'Next.js',
    icon: '/assets/techicons/nextjs.svg',
    alt: '',
    invertOnDark: true,
  },
  { name: 'Redux', icon: '/assets/techicons/redux.svg', alt: '' },
  { name: 'Node.js', icon: '/assets/techicons/nodejs.svg', alt: '' },
  { name: 'Figma', icon: '/assets/techicons/figma.svg', alt: '' },
  { name: 'Tailwind CSS', icon: '/assets/techicons/tailwindcss.svg', alt: '' },
  { name: 'Git', icon: '/assets/techicons/git.svg', alt: '' },
  { name: 'Sass', icon: '/assets/techicons/sass.svg', alt: '' },
  { name: 'jQuery', icon: '/assets/techicons/jquery.svg', alt: '' },
  { name: 'Claude AI', icon: '/assets/techicons/claude.svg', alt: '' },
  { name: 'Storybook', icon: '/assets/techicons/storybook-icon.svg', alt: '' },
  { name: 'Azure', icon: '/assets/techicons/azure.svg', alt: '' },
  { name: 'FastAPI', icon: '/assets/techicons/fastapi.svg', alt: '' },
  { name: 'PostgreSQL', icon: '/assets/techicons/postgresql.svg', alt: '' },
] as const;
