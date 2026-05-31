import 'server-only';

import {
  blogAuthors,
  blogIndustries,
  blogPageSize,
  blogPosts,
  blogTopics,
  type BlogAuthor,
  type BlogIndustry,
  type BlogPost,
  type BlogTopic,
} from '@/lib/blog';
import { buildBlogPostFromEntry } from '@/lib/editorial-content';
import { getPublishedAdminEditorialBlogEntries } from '@/server/admin/editorial-content';

export type BlogCatalog = {
  sourceMode: 'code-seeded' | 'admin-managed';
  authors: BlogAuthor[];
  industries: BlogIndustry[];
  pageSize: number;
  posts: BlogPost[];
  topics: BlogTopic[];
};

export type BlogFilters = {
  query?: string;
  topic?: string;
  industry?: string;
  author?: string;
  year?: string;
};

export async function getBlogCatalog(locale = 'en-US'): Promise<BlogCatalog> {
  const adminEntries = await getPublishedAdminEditorialBlogEntries(locale);
  const mergedPosts = new Map(blogPosts.map((post) => [post.slug, post]));

  for (const entry of adminEntries) {
    mergedPosts.set(entry.slug, buildBlogPostFromEntry(entry));
  }

  return {
    sourceMode: adminEntries.length ? 'admin-managed' : 'code-seeded',
    authors: [...blogAuthors],
    industries: [...blogIndustries],
    pageSize: blogPageSize,
    posts: Array.from(mergedPosts.values()).sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt)),
    topics: [...blogTopics],
  };
}

export async function getPublishedBlogPosts(locale = 'en-US') {
  const catalog = await getBlogCatalog(locale);
  return catalog.posts;
}

export function getBlogAuthorById(catalog: BlogCatalog, authorId: string) {
  return catalog.authors.find((author) => author.id === authorId);
}

export function getBlogPostBySlug(catalog: BlogCatalog, slug: string) {
  return catalog.posts.find((post) => post.slug === slug);
}

export function getBlogYears(catalog: BlogCatalog) {
  return Array.from(new Set(catalog.posts.map((post) => new Date(post.publishedAt).getUTCFullYear().toString()))).sort((left, right) => Number(right) - Number(left));
}

export function filterBlogPosts(catalog: BlogCatalog, filters: BlogFilters) {
  const query = filters.query?.trim().toLowerCase() ?? '';

  return catalog.posts.filter((post) => {
    const author = getBlogAuthorById(catalog, post.authorId);
    const matchesQuery = !query || `${post.title} ${post.seoTitle ?? ''} ${post.summary} ${post.seoDescription ?? ''} ${post.lead} ${author?.name ?? ''}`.toLowerCase().includes(query);
    const matchesTopic = !filters.topic || post.topic === filters.topic;
    const matchesIndustry = !filters.industry || post.industry === filters.industry;
    const matchesAuthor = !filters.author || post.authorId === filters.author;
    const matchesYear = !filters.year || new Date(post.publishedAt).getUTCFullYear().toString() === filters.year;

    return matchesQuery && matchesTopic && matchesIndustry && matchesAuthor && matchesYear;
  });
}

export function paginateBlogPosts(posts: BlogPost[], page: number, pageSize = blogPageSize) {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    page: currentPage,
    totalPages,
    items: posts.slice(startIndex, startIndex + pageSize),
  };
}

export function getMostReadPosts(catalog: BlogCatalog, limit = 4) {
  return [...catalog.posts].sort((left, right) => right.viewCount - left.viewCount).slice(0, limit);
}

export function getRelatedPosts(catalog: BlogCatalog, post: BlogPost, limit = 3) {
  return post.relatedPostSlugs
    .map((slug) => getBlogPostBySlug(catalog, slug))
    .filter((item): item is BlogPost => Boolean(item))
    .slice(0, limit);
}