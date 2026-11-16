document.addEventListener('DOMContentLoaded', () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  // Pastikan daftar artikel sudah tersedia, termasuk saat halaman detail dibuka langsung.
  if (!window.MEDIARENT_BLOGS?.length && typeof renderBlogs === 'function') {
    renderBlogs();
  }
  const articles = window.MEDIARENT_BLOGS || [];
  const article = articles.find(item => item.slug === slug);

  if (!article) {
    document.querySelector('#article-detail article')?.classList.add('hidden');
    document.getElementById('article-not-found')?.classList.remove('hidden');
    document.title = 'Artikel tidak ditemukan | MediaRent';
    return;
  }

  document.title = `${article.judul} | MediaRent`;
  const image = document.getElementById('article-image');
  image.src = article.gambar || '';
  image.alt = article.judul;
  document.getElementById('article-category').textContent = article.kategori || 'Artikel';
  document.getElementById('article-title').textContent = article.judul;
  document.getElementById('article-summary').textContent = article.ringkasan || '';

  const body = document.getElementById('article-body');
  (article.isi || []).forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    body.appendChild(paragraph);
  });
});
