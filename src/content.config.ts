import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

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

export const collections = { blog, 'blog-es': blogEs, 'blog-ar': blogAr };
