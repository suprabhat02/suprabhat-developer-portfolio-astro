export interface Role {
  title: string;
  start: string;
  end: string;
  location?: string;
  mode?: string;
  duration?: string;
  promotion?: boolean;
  bullets: readonly string[];
}

export interface Position {
  id: string;
  company: string;
  /** Set when the company row itself is the role (no sub-timeline). */
  title?: string;
  start: string;
  end: string;
  location?: string;
  mode?: string;
  duration?: string;
  bullets?: readonly string[];
  /** Newest first. Used for the MobileCoderz promotion timeline. */
  roles?: readonly Role[];
}

/** Dates, locations, modes, titles and bullets are verbatim. */
export const experience: readonly Position[] = [
  {
    id: 'topsoe',
    company: 'Topsoe',
    title: 'Software Engineer III',
    start: 'May 2025',
    end: 'Present',
    mode: 'Hybrid',
    bullets: [
      'Build sleek, modern interfaces with React and TypeScript.',
      'Ship predictable UI state with Redux Toolkit.',
      'Collaborate with cross-functional teams in a hybrid setup.',
    ],
  },
  {
    id: 'cognizant',
    company: 'Cognizant',
    title: 'Associate Projects',
    start: 'Feb 2024',
    end: 'Apr 2025',
    location: 'Noida, Uttar Pradesh, India',
    mode: 'On-site',
    bullets: [
      'Developed UI features using TypeScript.',
      'Worked with GraphQL-backed data flows.',
      'Implemented responsive, modern user interfaces.',
    ],
  },
  {
    id: 'trueblue',
    company: 'TrueBlue Inc.',
    title: 'Implementation Web Developer',
    start: 'Dec 2023',
    end: 'Jan 2024',
    location: 'Gurugram, Haryana, India',
    mode: 'On-site',
    bullets: [
      'Implemented responsive UI updates for web experiences.',
      'Integrated components and ensured consistent UI behavior.',
    ],
  },
  {
    id: 'mobilecoderz',
    company: 'MobileCoderz',
    start: 'Feb 2022',
    end: 'Nov 2023',
    location: 'Noida, Uttar Pradesh, India',
    duration: '1.8 years',
    roles: [
      {
        title: 'Senior Frontend Developer',
        start: 'Oct 2023',
        end: 'Nov 2023',
        promotion: true,
        bullets: [
          'Built modern front-end experiences with React and Next.js.',
          'Collaborated on UI delivery and component integration.',
        ],
      },
      {
        title: 'Frontend Developer',
        start: 'Feb 2022',
        end: 'Sep 2023',
        bullets: [
          'Developed responsive interfaces and reusable UI components.',
          'Worked across React, TypeScript, and modern CSS.',
        ],
      },
    ],
  },
  {
    id: 'swaragh',
    company: 'Swaragh Technologies',
    title: 'UI Developer',
    start: 'Dec 2019',
    end: 'Jan 2022',
    location: 'Bengaluru, Karnataka, India',
    bullets: [
      'Created responsive UI using HTML, CSS, and JavaScript.',
      'Built interactive behaviors with jQuery where needed.',
    ],
  },
] as const;
