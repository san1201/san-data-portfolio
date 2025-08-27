async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    const projects = await res.json();
    const selected = projects.slice(0, 6);
    const cards = selected.map(p => `
      <article class="card">
        <div class="badge">${p.domain} • ${p.stack.join(', ')}</div>
        <h3><a href="${p.caseStudyUrl || p.repo || '#'}" target="_blank" rel="noopener">${p.title}</a></h3>
        <p>${p.summary}</p>
      </article>
    `).join('');
    const cardsEl = document.getElementById('project-cards');
    if (cardsEl) cardsEl.innerHTML = cards;

    const gridEl = document.getElementById('project-grid');
    if (gridEl) gridEl.innerHTML = projects.map(p => `
      <article class="card">
        <div class="badge">${p.domain} • ${p.stack.join(', ')}</div>
        <h3><a href="${p.caseStudyUrl || p.repo || '#'}" target="_blank" rel="noopener">${p.title}</a></h3>
        <p>${p.summary}</p>
        <ul>
          <li><strong>Dataset:</strong> ${p.dataset || 'N/A'}</li>
          <li><strong>Impact:</strong> ${p.impact || '—'}</li>
          <li><strong>Metrics:</strong> ${p.metrics?.join(', ') || '—'}</li>
        </ul>
      </article>
    `).join('');

    // Blog list
    const blogList = document.getElementById('blog-list');
    if (blogList) {
      const postsRes = await fetch('blog/posts/index.json');
      const posts = await postsRes.json();
      blogList.innerHTML = posts.map(post => `
        <article class="card">
          <h3><a href="blog/post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a></h3>
          <p class="badge">${post.date}</p>
          <p>${post.excerpt}</p>
        </article>
      `).join('');
    }

    // Blog post rendering
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    if (location.pathname.endsWith('/blog/post.html') && slug) {
      const md = await fetch(`posts/${slug}.md`).then(r => r.text());
      const target = document.getElementById('post-content');
      target.textContent = md; // Basic render; replace with a markdown parser later if desired
    }
  } catch (e) {
    console.error(e);
  }
}
document.addEventListener('DOMContentLoaded', loadProjects);
