#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import fm from 'front-matter';
import { marked } from 'marked';

const rootDir = path.resolve(process.cwd());
const postsDir = path.join(rootDir, 'posts');
const outDir = path.join(rootDir, 'public', 'blog');

function slugify(filename) {
	return filename
		.replace(/\\/g, '/')
		.split('/')
		.pop()
		.replace(/\.[^.]+$/, '')
		.replace(/[^a-zA-Z0-9-_]+/g, '-');
}

function stripHtml(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

async function ensureDir(dir) {
	await fs.mkdir(dir, { recursive: true });
}

async function readMarkdownFiles(dir) {
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		const files = entries
			.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
			.map((e) => path.join(dir, e.name));
		return files;
	} catch (e) {
		if (e.code === 'ENOENT') return [];
		throw e;
	}
}

async function build() {
	await ensureDir(outDir);
	const mdFiles = await readMarkdownFiles(postsDir);

	const index = [];

	for (const file of mdFiles) {
		const raw = await fs.readFile(file, 'utf-8');
		const { attributes, body } = fm(raw);
		const html = marked.parse(body);
		const text = stripHtml(html);
		const stat = await fs.stat(file);
		const slug = attributes.slug || slugify(file);
		const title = attributes.title || slug;
		const dateIso = attributes.date || stat.mtime.toISOString();
		const tags = Array.isArray(attributes.tags) ? attributes.tags : (attributes.tags ? String(attributes.tags).split(',').map(s=>s.trim()).filter(Boolean) : []);
		const category = attributes.category || 'others';
		const summary = attributes.summary || text.slice(0, 160);

		const postData = {
			slug,
			title,
			date: dateIso,
			tags,
			category,
			summary,
			html,
		};

		await fs.writeFile(path.join(outDir, `${slug}.json`), JSON.stringify(postData, null, 2), 'utf-8');

		index.push({ slug, title, date: dateIso, tags, category, summary });
	}

	// sort by date desc
	index.sort((a, b) => new Date(b.date) - new Date(a.date));
	await fs.writeFile(path.join(outDir, `index.json`), JSON.stringify(index, null, 2), 'utf-8');

	return { count: index.length };
}

build()
	.then(({ count }) => {
		console.log(`[blog] Built ${count} posts -> public/blog/`);
	})
	.catch((err) => {
		console.error('[blog] Build failed:', err);
		process.exit(1);
	}); 