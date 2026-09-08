import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const caseStudySchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1),
    locale: z.enum(['en', 'es', 'ar']),
    summary: z.string().min(1),
    projectCategory: z.string().min(1),
    confidentialityStatus: z.enum(['public', 'anonymized', 'confidential']),
    role: z.string().min(1),
    responsibilities: z.array(z.string().min(1)).min(1),
    duration: z.string().min(1),
    teamContext: z.string().min(1),
    problem: z.array(z.string().min(1)).min(1),
    constraints: z.array(z.string().min(1)).default([]),
    technicalConstraints: z.array(z.string().min(1)).default([]),
    optionsConsidered: z
      .array(
        z.object({
          option: z.string().min(1),
          tradeoffs: z.string().min(1),
        }),
      )
      .default([]),
    decision: z.array(z.string().min(1)).min(1),
    implementation: z.array(z.string().min(1)).min(1),
    accessibilityApproach: z.array(z.string().min(1)).default([]),
    performanceApproach: z.array(z.string().min(1)).default([]),
    testingApproach: z.array(z.string().min(1)).default([]),
    securityConsiderations: z.array(z.string().min(1)).default([]),
    outcomes: z.array(z.string().min(1)).default([]),
    lessonsLearned: z.array(z.string().min(1)).default([]),
    technologies: z.array(z.string().min(1)).min(1),
    featured: z.boolean().default(false),
    verified: z.boolean().default(false),
    draft: z.boolean().default(true),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    canonicalUrl: z.url(),
    relatedServices: z.array(z.string().min(1)).default([]),
    relatedArticles: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const serviceSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1),
    locale: z.enum(['en', 'es', 'ar']),
    summary: z.string().min(1),
    idealClient: z.array(z.string().min(1)).min(1),
    symptoms: z.array(z.string().min(1)).min(1),
    deliverables: z.array(z.string().min(1)).min(1),
    workingProcess: z.array(z.string().min(1)).min(1),
    typicalDuration: z.string().min(1),
    engagementModels: z.array(z.string().min(1)).min(1),
    prerequisites: z.array(z.string().min(1)).default([]),
    exclusions: z.array(z.string().min(1)).default([]),
    relatedCaseStudies: z.array(z.string().min(1)).default([]),
    relatedWriting: z.array(z.string().min(1)).default([]),
    cta: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
    featured: z.boolean().default(false),
    verified: z.boolean().default(false),
    draft: z.boolean().default(true),
    canonicalUrl: z.url(),
  })
  .strict();

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: postSchema,
});

const blogEs = defineCollection({
  loader: glob({ base: './src/content/blog-es', pattern: '**/*.md' }),
  schema: postSchema,
});

const blogAr = defineCollection({
  loader: glob({ base: './src/content/blog-ar', pattern: '**/*.md' }),
  schema: postSchema,
});

const caseStudies = defineCollection({
  loader: file('./src/content/case-studies.json'),
  schema: caseStudySchema,
});

const services = defineCollection({
  loader: file('./src/content/services.json'),
  schema: serviceSchema,
});

export const collections = {
  blog,
  'blog-es': blogEs,
  'blog-ar': blogAr,
  'case-studies': caseStudies,
  services,
};
