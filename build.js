/**
 * Minimalist Center-Aligned Static Site & Markdown Build Pipeline
 * Powered by Marked + KaTeX + Gray-Matter + Mermaid
 * Zero client-side JavaScript required for Markdown/Math.
 * Flowcharts rendered via Mermaid ESM on demand.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const katex = require('katex');

const ROOT_DIR = __dirname;
const BLOGS_DIR = path.join(ROOT_DIR, 'blogs');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(ROOT_DIR, 'prototype');
const CLOUD_DIST_DIR = path.join(ROOT_DIR, 'dist');

// Ensure output directories exist
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'writing'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'css'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'js'), { recursive: true });

fs.mkdirSync(CLOUD_DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(CLOUD_DIST_DIR, 'writing'), { recursive: true });
fs.mkdirSync(path.join(CLOUD_DIST_DIR, 'css'), { recursive: true });
fs.mkdirSync(path.join(CLOUD_DIST_DIR, 'js'), { recursive: true });

function processMathAndMarkdown(mdContent) {
  let hasMermaid = false;

  // 1. Block Math: $$ ... $$
  let processed = mdContent.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return `<div class="math-block">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch (err) {
      return match;
    }
  });

  // 2. Inline Math: $ ... $
  processed = processed.replace(/(?<!\\)\$([^\$\n]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch (err) {
      return match;
    }
  });

  // 3. Custom renderer for Mermaid & standard code blocks
  const renderer = new marked.Renderer();
  renderer.code = function(tokenOrCode, infostring) {
    const code = typeof tokenOrCode === 'object' ? tokenOrCode.text : tokenOrCode;
    const lang = (typeof tokenOrCode === 'object' ? tokenOrCode.lang : infostring) || '';

    if (lang.trim().toLowerCase() === 'mermaid') {
      hasMermaid = true;
      return `<div class="mermaid-container"><pre class="mermaid">\n${code.trim()}\n</pre></div>\n`;
    }
    return `<pre><code class="language-${lang}">${code}</code></pre>\n`;
  };

  let html = marked.parse(processed, { renderer, gfm: true, breaks: false });

  // 4. Relative Image Paths
  html = html.replace(/<img src="\/([^"]+)" alt="([^"]*)"/g, '<figure style="text-align:center;margin:2rem 0;"><img src="../$1" alt="$2" style="max-width:100%;border-radius:6px;border:1px solid var(--border);"><figcaption style="color:var(--muted);font-size:0.82rem;margin-top:0.5rem;font-family:var(--font-mono);">$2</figcaption></figure>');

  return { html, hasMermaid };
}

// --- Date Parsing and Normalization ---
const MONTH_MAP = {
  'jan': { num: 0, name: 'Jan' },
  'january': { num: 0, name: 'Jan' },
  'feb': { num: 1, name: 'Feb' },
  'february': { num: 1, name: 'Feb' },
  'mar': { num: 2, name: 'Mar' },
  'march': { num: 2, name: 'Mar' },
  'apr': { num: 3, name: 'Apr' },
  'april': { num: 3, name: 'Apr' },
  'may': { num: 4, name: 'May' },
  'jun': { num: 5, name: 'Jun' },
  'june': { num: 5, name: 'Jun' },
  'jul': { num: 6, name: 'Jul' },
  'july': { num: 6, name: 'Jul' },
  'aug': { num: 7, name: 'Aug' },
  'august': { num: 7, name: 'Aug' },
  'sep': { num: 8, name: 'Sep' },
  'september': { num: 8, name: 'Sep' },
  'oct': { num: 9, name: 'Oct' },
  'october': { num: 9, name: 'Oct' },
  'nov': { num: 10, name: 'Nov' },
  'november': { num: 10, name: 'Nov' },
  'dec': { num: 11, name: 'Dec' },
  'december': { num: 11, name: 'Dec' },
};

function parseDateInfo(rawDateStr) {
  if (!rawDateStr) return { timestamp: 0, display: '2026' };
  
  const clean = String(rawDateStr).trim().toLowerCase();
  const parts = clean.split(/[\s,.-]+/);
  
  let month = 0;
  let year = 2026;
  let hasMonth = false;

  for (const part of parts) {
    if (MONTH_MAP[part]) {
      month = MONTH_MAP[part].num;
      hasMonth = true;
    } else if (/^\d{4}$/.test(part)) {
      year = parseInt(part, 10);
    }
  }

  const foundMonthKey = parts.find(p => MONTH_MAP[p]);
  const monthName = foundMonthKey ? MONTH_MAP[foundMonthKey].name : 'Jan';
  
  const display = hasMonth ? `${monthName} ${year}` : `${year}`;
  const timestamp = new Date(year, month, 1).getTime();

  return { timestamp, display, year, month };
}

// --- Helper: Render Project Links ---
function renderProjectLinks(proj, depth = 0) {
  const rootRel = depth === 0 ? '' : '../';
  const links = [];

  // GitHub Link
  if (proj.github && proj.github.trim() !== '') {
    links.push(`<a href="${proj.github}" target="_blank" rel="noopener noreferrer">github</a>`);
  }

  // Live / PyPI / App Link
  if (proj.link && proj.link.trim() !== '') {
    if (proj.link.startsWith('/writing/')) {
      const slug = proj.link.replace('/writing/', '');
      links.push(`<a href="${rootRel}writing/${slug}.html">blog &rarr;</a>`);
    } else if (proj.link.includes('pypi.org')) {
      links.push(`<a href="${proj.link}" target="_blank" rel="noopener noreferrer">pypi ↗</a>`);
    } else if (proj.link !== proj.github) {
      links.push(`<a href="${proj.link}" target="_blank" rel="noopener noreferrer">link ↗</a>`);
    }
  }

  // Separate Blog Link (e.g. Notion, Medium, or local)
  if (proj.blog && proj.blog.trim() !== '') {
    const isInternal = proj.blog.startsWith('/writing/');
    const href = isInternal ? `${rootRel}writing/${proj.blog.replace('/writing/', '')}.html` : proj.blog;
    const target = isInternal ? '' : 'target="_blank" rel="noopener noreferrer"';
    links.push(`<a href="${href}" ${target}>blog ${isInternal ? '&rarr;' : '↗'}</a>`);
  }

  return links.join('');
}

// --- SVG Icons for Socials ---
const ICONS = {
  github: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  linkedin: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  twitter: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  email: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
};

const SOCIAL_ICONS_MAP = {
  'GitHub': ICONS.github,
  'LinkedIn': ICONS.linkedin,
  'Twitter': ICONS.twitter,
  'Email': ICONS.email
};

// --- Centered Layout Template with Single Fin Bar ---
function renderLayout({ title, description, activeTab = 'about', content, depth = 0, hasMath = false, hasMermaid = false, backLink = null }) {
  const rootRel = depth === 0 ? '' : '../';

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="${rootRel}css/style.css">
  ${hasMath ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">' : ''}
</head>
<body>

  <div class="page-container">
    <!-- Centered Top Bar with Middle Dots -->
    <header class="top-bar">
      <nav>
        <ul class="nav-links">
          <li><a href="${rootRel}index.html" class="${activeTab === 'about' ? 'active' : ''}">about</a></li>
          <li><a href="${rootRel}index.html#experience">experience</a></li>
          <li><a href="${rootRel}writing.html" class="${activeTab === 'writing' ? 'active' : ''}">writing</a></li>
          <li><a href="${rootRel}projects.html" class="${activeTab === 'projects' ? 'active' : ''}">projects</a></li>
          <li><a href="${rootRel}attention-windowing.html" class="${activeTab === 'research' ? 'active' : ''}">research</a></li>
          <li><a href="https://drive.google.com/file/d/1IonheWXeP6qduIyeO9GQjwvc1XvxbtZ2/view?usp=sharing" target="_blank" rel="noopener noreferrer">resume ↗</a></li>
          <li>
            <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">[theme]</button>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      ${content}
    </main>

    <!-- Single Bottom Bar: fin. on the left, back button on the right -->
    <footer class="fin-bar">
      <span class="fin-text">fin.</span>
      ${backLink ? `<a href="${backLink.href}" class="back-link">&larr; ${backLink.label}</a>` : '<span></span>'}
    </footer>
  </div>

  <script src="${rootRel}js/main.js"></script>
  ${hasMermaid ? `
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'neutral',
      themeVariables: {
        fontFamily: 'Syne Mono, monospace',
        primaryColor: isDark ? '#27272a' : '#f4f4f5',
        primaryTextColor: isDark ? '#f4f4f5' : '#18181b',
        primaryBorderColor: isDark ? '#3f3f46' : '#e4e4e7',
        lineColor: isDark ? '#a1a1aa' : '#71717a',
        secondaryColor: isDark ? '#18181b' : '#ffffff',
        tertiaryColor: isDark ? '#18181b' : '#ffffff'
      }
    });
  </script>` : ''}
</body>
</html>`;
}

// --- Main Build Logic ---
function build() {
  console.log('⚡ Building minimalist centered static portfolio...');

  // 1. Load content.json
  const rawContent = fs.readFileSync(path.join(PUBLIC_DIR, 'content.json'), 'utf8');
  const data = JSON.parse(rawContent);

  // 2. Discover & Parse Markdown Blogs
  const blogFiles = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));
  const blogs = blogFiles.map(filename => {
    const slug = filename.replace('.md', '');
    const fileContent = fs.readFileSync(path.join(BLOGS_DIR, filename), 'utf8');
    const { data: frontmatter, content: body } = matter(fileContent);

    const words = body.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    const dateInfo = parseDateInfo(frontmatter.date || '2026');

    return {
      slug,
      title: frontmatter.title || slug.replace(/-/g, ' '),
      description: frontmatter.description || body.slice(0, 160) + '...',
      date: dateInfo.display,
      timestamp: dateInfo.timestamp,
      tags: frontmatter.tags || [],
      body,
      readTime
    };
  });

  // 3. Generate Individual Blog Pages
  blogs.forEach(blog => {
    const { html: articleHtml, hasMermaid } = processMathAndMarkdown(blog.body);
    const pageHtml = renderLayout({
      title: `${blog.title} | bala`,
      description: blog.description,
      activeTab: 'writing',
      depth: 1,
      hasMath: true,
      hasMermaid,
      backLink: { href: '../writing.html', label: 'back to writing' },
      content: `
        <article class="article-body">
          <div style="margin-bottom: 1.5rem;">
            <a href="../writing.html" class="back-link">&larr; back to writing</a>
          </div>

          <h1>${blog.title}</h1>

          <div class="article-meta-bar">
            <span>${blog.date}</span>
            <span>&middot;</span>
            <span>${blog.readTime} min read</span>
            <span>&middot;</span>
            <span>${blog.tags.join(', ').toLowerCase()}</span>
          </div>

          ${articleHtml}
        </article>
      `
    });

    fs.writeFileSync(path.join(DIST_DIR, 'writing', `${blog.slug}.html`), pageHtml);
    console.log(`  ✓ Compiled blog: writing/${blog.slug}.html (mermaid: ${hasMermaid})`);
  });

  // Prepare combined writings with Attention Windowing and all items
  const allWritings = [
    {
      title: "Attention Windowing",
      description: "a research program on measuring exactly how much of attention is slack, per head and causally, then deploying the measurement as compression.",
      date: parseDateInfo("Jul 2026").display,
      timestamp: parseDateInfo("Jul 2026").timestamp,
      tags: ["transformers", "compression"],
      href: "attention-windowing.html",
      external: false
    },
    ...blogs.map(b => ({
      title: b.title,
      description: b.description,
      date: b.date,
      timestamp: b.timestamp,
      tags: b.tags,
      href: `writing/${b.slug}.html`,
      external: false
    })),
    ...data.writings.map(w => {
      const dateInfo = parseDateInfo(w.date);
      let href = w.link;
      if (w.link.startsWith('/publications/all-routes')) {
        href = 'publications-all-routes.html';
      } else if (w.link.startsWith('/publications/decentralized')) {
        href = 'publications-identity.html';
      } else if (w.link.startsWith('/writing/')) {
        href = `writing/${w.link.replace('/writing/', '')}.html`;
      }

      return {
        title: w.title,
        description: w.description,
        date: dateInfo.display,
        timestamp: dateInfo.timestamp,
        tags: w.tags,
        href,
        external: href.startsWith('http')
      };
    })
  ];

  // De-duplicate by title and sort Latest -> Oldest
  const uniqueWritings = [];
  const seenWriting = new Set();
  for (const w of allWritings) {
    if (!seenWriting.has(w.title)) {
      seenWriting.add(w.title);
      uniqueWritings.push(w);
    }
  }
  uniqueWritings.sort((a, b) => b.timestamp - a.timestamp);

  // Normalize and sort Projects chronologically Latest -> Oldest
  const allProjects = data.projects.map(p => {
    const dateInfo = parseDateInfo(p.date || '2025');
    return {
      ...p,
      displayDate: dateInfo.display,
      timestamp: dateInfo.timestamp
    };
  });
  allProjects.sort((a, b) => b.timestamp - a.timestamp);

  const featuredProjects = allProjects.filter(p => p.featured);

  // 4. Generate Minimal Homepage (index.html)
  const homeContent = `
    <!-- Minimal Hero -->
    <section class="hero-section">
      <div class="hero-header">
        <div>
          <h1 class="hero-title">hi, i'm bala</h1>
        </div>
        <img src="me.jpg" alt="Bala" class="hero-avatar">
      </div>

      <div class="hero-bio">
        <p>i'm 21, finishing my masters in cs. i build systems: mostly agentic, deterministic pipelines, developer tooling that doesn't lie to you about what it's doing.</p>
        <p>right now that's distributed systems, real-time sync, and applied AI, plus a couple of research threads on the side. also slowly drifting back toward robotics, which is where i started caring about any of this in the first place.</p>
      </div>

      <div class="social-links-row">
        ${data.socials.map(s => `
          <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-icon-link" title="${s.platform}">
            ${SOCIAL_ICONS_MAP[s.platform] || s.platform}
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Experience (Minimal: No Descriptions, Company Titles Preserved) -->
    <section id="experience" class="section-block">
      <h2 class="section-heading">experience</h2>
      <div class="exp-list">
        ${data.experiences.map(exp => `
          <div>
            <div class="exp-row">
              <span class="exp-role">AI agentic R&D intern - NTT GDC</span>
              <span class="exp-date">${exp.period.toLowerCase()}</span>
            </div>
            <div class="exp-tags">
              LLM · MCP · Google ADK · Crew AI · Semantic Kernel · async systems
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Writing (Directly following Experience, Sorted Latest -> Oldest) -->
    <section id="writing" class="section-block">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.25rem;border-bottom:1px solid var(--border);padding-bottom:0.4rem;">
        <h2 class="section-heading" style="border:none;margin:0;padding:0;">writing &amp; research</h2>
        <a href="writing.html" style="font-family:var(--font-mono);font-size:0.8rem;color:var(--muted);">all entries &rarr;</a>
      </div>

      <div class="writing-list">
        ${uniqueWritings.slice(0, 6).map(item => `
          <div class="writing-item-row">
            <a href="${item.href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="writing-link-title">
              ${item.title} ${item.external ? '↗' : ''}
            </a>
            <span class="writing-date-meta">${item.date}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Projects (Renamed from Selected Projects, Chronologically Ordered) -->
    <section id="projects" class="section-block">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.25rem;border-bottom:1px solid var(--border);padding-bottom:0.4rem;">
        <h2 class="section-heading" style="border:none;margin:0;padding:0;">projects</h2>
        <a href="projects.html" style="font-family:var(--font-mono);font-size:0.8rem;color:var(--muted);">archive &rarr;</a>
      </div>

      <div class="projects-list">
        ${featuredProjects.map(proj => `
          <div class="project-item">
            <div class="project-item-top">
              <span class="project-item-title">${proj.title}</span>
              <div class="project-item-links">
                ${renderProjectLinks(proj, 0)}
              </div>
            </div>
            <p class="project-item-desc">${proj.description.charAt(0).toLowerCase() + proj.description.slice(1)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), renderLayout({
    title: 'balasubramanian kr (bala)',
    description: 'personal portfolio and research logs of balasubramanian kr.',
    activeTab: 'about',
    content: homeContent,
    backLink: null
  }));
  console.log('  ✓ Generated index.html');

  // 5. Generate Projects Archive (projects.html - Chronologically Ordered)
  const projectsContent = `
    <div style="margin-bottom:1.5rem;">
      <a href="index.html" class="back-link">&larr; back to home</a>
    </div>

    <div style="margin-bottom:2.5rem;">
      <h1 style="font-size:1.85rem;font-weight:500;margin-bottom:0.4rem;letter-spacing:-0.02em;">projects</h1>
      <p style="color:var(--muted);font-size:0.98rem;">
        chronological log of infrastructure, tools, and experiments.
      </p>
    </div>

    <div class="projects-list">
      ${allProjects.map(proj => `
        <div class="project-item project-item-divided">
          <div class="project-item-top">
            <span class="project-item-title">${proj.title}</span>
            <div class="project-item-links">
              ${renderProjectLinks(proj, 0)}
            </div>
          </div>
          <p class="project-item-desc">${proj.description.charAt(0).toLowerCase() + proj.description.slice(1)}</p>
          <div class="project-item-meta">
            <span>${proj.tags.join(' · ')}</span>
            <span>${proj.displayDate}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  fs.writeFileSync(path.join(DIST_DIR, 'projects.html'), renderLayout({
    title: 'projects | bala',
    description: 'archive of systems tools, research prototypes, and experiments.',
    activeTab: 'projects',
    content: projectsContent,
    backLink: { href: 'index.html', label: 'back to home' }
  }));
  console.log('  ✓ Generated projects.html');

  // 6. Generate Writing Index (writing.html)
  const writingContent = `
    <div style="margin-bottom:1.5rem;">
      <a href="index.html" class="back-link">&larr; back to home</a>
    </div>

    <div style="margin-bottom:2.5rem;">
      <h1 style="font-size:1.85rem;font-weight:500;margin-bottom:0.4rem;letter-spacing:-0.02em;">writing &amp; research</h1>
      <p style="color:var(--muted);font-size:0.98rem;">
        preprints, articles, linguistics notes, and systems investigations.
      </p>
    </div>

    <div class="writing-list">
      ${uniqueWritings.map(item => `
        <div class="writing-item-row writing-item-row-divided">
          <div>
            <a href="${item.href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="writing-link-title">
              ${item.title} ${item.external ? '↗' : ''}
            </a>
            <p style="color:var(--muted);font-size:0.88rem;margin-top:0.2rem;line-height:1.5;">${item.description.charAt(0).toLowerCase() + item.description.slice(1)}</p>
          </div>
          <span class="writing-date-meta">${item.date}</span>
        </div>
      `).join('')}
    </div>
  `;

  fs.writeFileSync(path.join(DIST_DIR, 'writing.html'), renderLayout({
    title: 'writing | bala',
    description: 'technical logs, preprints, and research articles by balasubramanian kr.',
    activeTab: 'writing',
    content: writingContent,
    backLink: { href: 'index.html', label: 'back to home' }
  }));
  console.log('  ✓ Generated writing.html');

  // 7. Copy Static Assets
  const assetsToCopy = ['me.jpg', 'umap_steno.png', 'umap_steno_onset.png', 'favicon.ico'];
  assetsToCopy.forEach(asset => {
    const src = path.join(PUBLIC_DIR, asset);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST_DIR, asset));
    }
  });

  // 8. Mirror prototype to dist for Cloudflare Pages defaults
  fs.cpSync(DIST_DIR, CLOUD_DIST_DIR, { recursive: true });

  console.log('✨ Build complete in prototype/ & dist/');
}

build();
