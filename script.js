const defaultAppData = {
  products: [
    {
      id: 1,
      name: "Smart TV 32 Inch",
      category: "TV & Touchscreen",
      price: 150000,
      description: "TV LED 32 Inch Full HD cocok untuk display booth.",
      image_url: "https://cdn.polytron.co.id/public-assets/polytroncoid/2026/06/PLD-32TC1865.webp"
    },
    {
      id: 2,
      name: "Smart TV 43 Inch",
      category: "TV & Touchscreen",
      price: 250000,
      description: "Smart TV 43 Inch 4K UHD ideal untuk area registrasi.",
      image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Smart TV 65 Inch",
      category: "TV & Touchscreen",
      price: 500000,
      description: "TV Layar Besar 65 Inch 4K UHD untuk backdrop event.",
      image_url: "https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Touchscreen Interactive TV 55 Inch",
      category: "TV & Touchscreen",
      price: 750000,
      description: "TV Interaktif layar sentuh 55 Inch untuk Kiosk & Game Booth.",
      image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Starlink Gen 3 Satellite Kit",
      category: "Internet & Network",
      price: 750000,
      description: "Internet Satelit Starlink Gen 3 Unlimited Kuota High-Speed.",
      image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      name: "Modem Wifi Router 4G/5G Enterprise",
      category: "Internet & Network",
      price: 200000,
      description: "Modem Wi-Fi kencang support hingga 64 user.",
      image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 7,
      name: "Kabel LAN Cat6 Industrial (50 Meter)",
      category: "Aksesori & Kabel",
      price: 50000,
      description: "Kabel UTP LAN Cat6 50m untuk kestabilan koneksi streaming.",
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
    }
  ],
  portfolios: [],
  testimonials: [,
  {
      id: 1,
      client_name: "Budi Santoso",
      company_or_event: "EO Jakarta Event Fest",
      review: "Sewa Starlink Gen 3 dan TV lancar banget!",
      rating: 5,
      created_at: "2026-11-11T06:11:25.000000Z"
    }
  ];
  blogs: [],
  cart: []
};

let appData = structuredClone(defaultAppData);
let currentCategory = 'ALL';
let currentSearchKeyword = '';

const ADMIN_WHATSAPP = '6285780325481';
const API_BASE_URL = (() => {
  const { origin, pathname, port } = window.location;

  // VS Code Live Server uses the Laravel development server on port 8000.
  if (port === '5500' || port === '5501') return 'http://127.0.0.1:8000/api';

  // Under Laragon, call the Laravel public API on the same host and project path.
  const frontendPath = pathname.match(/^(.*)\/frontend\/[^/]*$/i);
  if (frontendPath) return `${origin}${frontendPath[1]}/backend/public/api`;

  return `${origin}/api`;
})();

// ==========================================
// 1. INISIALISASI & LOAD DATA DARI LARAVEL
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  renderBlogs();
  if (document.getElementById('article-detail')) return;
  const requestedPage = new URLSearchParams(window.location.search).get('page');
  if (['home', 'about', 'product', 'portfolio', 'testimoni', 'blog'].includes(requestedPage)) {
    navigateTo(requestedPage);
  }
  loadDataFromBackend();
});

async function loadDataFromBackend() {
  try {
    const resProducts = await fetch(`${API_BASE_URL}/products`);
    const dataProducts = await resProducts.json();
    if (dataProducts.status === 'success') {
      appData.products = dataProducts.data;
    }

    const resTestimonials = await fetch(`${API_BASE_URL}/testimonials`);
    const dataTestimonials = await resTestimonials.json();
    if (dataTestimonials.status === 'success') {
      appData.testimonials = dataTestimonials.data;
    }
  } catch (err) {
    console.warn('Mode Demo Statis (GitHub Pages): Menggunakan katalog bawaan.');
    // Pastikan data default tetap terisi jika API Laravel tidak aktif
    if (!appData.products || appData.products.length === 0) {
      appData.products = structuredClone(defaultAppData.products);
    }
    if (!appData.testimonials || appData.testimonials.length === 0) {
      appData.testimonials = structuredClone(defaultAppData.testimonials);
    }
  } finally {

    renderHomeFeatured();
    renderProductsCatalog(currentSearchKeyword);
    renderPortfolios();
    renderTestimonials();
    renderBlogs();
  }
}

// ==========================================
// 2. NAVIGASI & PENCARIAN
// ==========================================
function navigateTo(pageId, shouldScrollToTop = true) {
  const pages = ['home', 'about', 'product', 'portfolio', 'testimoni', 'blog'];
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.toggle('hidden', p !== pageId);
  });
  closeMobileMenu();
  if (shouldScrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-toggle');
  const icon = document.getElementById('mobile-menu-icon');
  if (!menu || !button) return;

  const isOpening = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !isOpening);
  button.setAttribute('aria-expanded', String(isOpening));
  button.setAttribute('aria-label', isOpening ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  icon?.classList.toggle('fa-bars', !isOpening);
  icon?.classList.toggle('fa-xmark', isOpening);
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-toggle');
  const icon = document.getElementById('mobile-menu-icon');
  if (!menu || !button) return;

  menu.classList.add('hidden');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Buka menu navigasi');
  icon?.classList.add('fa-bars');
  icon?.classList.remove('fa-xmark');
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMobileMenu();
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 1024px)').matches) closeMobileMenu();
});

function handleSearch(event) {
  currentSearchKeyword = (event.target.value || '').toLowerCase().trim();
  const productPage = document.getElementById('page-product');
  if (currentSearchKeyword.length > 0) {
    const needsNavigation = productPage?.classList.contains('hidden');
    if (needsNavigation) {
      navigateTo('product', false);
      requestAnimationFrame(() => {
        document.getElementById('products-catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
  renderProductsCatalog(currentSearchKeyword);
}

// ==========================================
// 3. RENDER PRODUK & FILTER KATEGORI
// ==========================================
function renderProductCardHTML(product) {
  const priceNumber = Number(product.price) || 0;
  const formattedPrice = priceNumber.toLocaleString('id-ID');

  return `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col justify-between">
      <div>
        <img src="${product.image_url || 'https://via.placeholder.com/300'}" alt="${product.name}" class="w-full h-48 object-cover">
        <div class="p-4 pb-2">
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded bg-red-50 text-red-600">${product.category}</span>
          <h3 class="font-bold text-lg text-gray-800 mt-2">${product.name}</h3>
          <p class="text-gray-500 text-sm mt-1 line-clamp-2">${product.description || ''}</p>
        </div>
      </div>
      <div class="p-4 pt-2 flex items-center justify-between">
        <div>
          <span class="text-xs text-gray-400">Mulai dari</span>
          <p class="text-red-600 font-bold text-lg">Rp ${formattedPrice} <span class="text-xs text-gray-500 font-normal">/ hari</span></p>
        </div>
        <button type="button" onclick="addToCart(${product.id})" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Sewa
        </button>
      </div>
    </div>
  `;
}

function renderHomeFeatured() {
  const grid = document.getElementById('home-featured-grid');
  if (!grid) return;
  const featured = (appData.products || []).slice(0, 4);
  grid.innerHTML = featured.map(p => renderProductCardHTML(p)).join('');
}

function filterCategory(categoryName) {
  currentCategory = categoryName;

  document.querySelectorAll('.prod-cat-btn').forEach(btn => {
    const isMatch = btn.innerText.toUpperCase().includes(categoryName.toUpperCase()) || 
                    (categoryName === 'ALL' && btn.innerText.toUpperCase().includes('SEMUA'));
    if (isMatch) {
      btn.classList.remove('bg-slate-100', 'text-slate-600');
      btn.classList.add('bg-red-600', 'text-white', 'shadow');
    } else {
      btn.classList.remove('bg-red-600', 'text-white', 'shadow');
      btn.classList.add('bg-slate-100', 'text-slate-600');
    }
  });

  renderProductsCatalog(currentSearchKeyword);
}

function filterProducts(categoryName) {
  filterCategory(categoryName);
}

function renderProductsCatalog(searchKeyword = currentSearchKeyword) {
  const container = document.getElementById('products-catalog-grid') || document.getElementById('product-grid');
  if (!container) return;

  const products = appData.products || [];

  const filteredProducts = products.filter(item => {
    const selected = (currentCategory || 'ALL').toUpperCase();
    const itemCat = (item.category || '').toUpperCase();
    const itemName = (item.name || '').toUpperCase();
    const itemDesc = (item.description || '').toUpperCase();

    if (searchKeyword) {
      const kw = searchKeyword.toUpperCase();
      const matchSearch = itemName.includes(kw) || itemCat.includes(kw) || itemDesc.includes(kw);
      if (!matchSearch) return false;
    }

    if (selected === 'ALL' || selected === 'SEMUA UNIT') return true;
    if (selected === 'TV') return itemCat.includes('TV') && !itemName.includes('TOUCHSCREEN');
    if (selected === 'TOUCHSCREEN') return itemCat.includes('TOUCHSCREEN') || itemName.includes('TOUCHSCREEN');
    if (selected === 'INTERNET') return itemCat.includes('INTERNET') || itemName.includes('STARLINK') || itemName.includes('MODEM');
    if (selected === 'AKSESORIS') return itemCat.includes('AKSESORIS') || itemCat.includes('KABEL') || itemName.includes('KABEL');

    return true;
  });

  if (filteredProducts.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-400 py-12">Unit tidak ditemukan.</p>`;
    return;
  }

  container.innerHTML = filteredProducts.map(product => renderProductCardHTML(product)).join('');
}

// ==========================================
// 4. KERANJANG BELANJA & KALKULASI HARI
// ==========================================
function addToCart(productId) {
  const product = (appData.products || []).find(p => p.id === productId);
  if (!product) return;

  if (!appData.cart) appData.cart = [];

  const existingItem = appData.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    appData.cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image_url: product.image_url,
      qty: 1
    });
  }

  updateCartUI();
  toggleCart(true);

  // Setelah paket dipilih, arahkan panel keranjang langsung ke formulir pemesanan.
  requestAnimationFrame(() => {
    const drawer = document.getElementById('cart-drawer');
    const scrollArea = drawer?.querySelector('.overflow-y-auto');
    const checkoutForm = document.getElementById('checkout-form');
    if (!scrollArea || !checkoutForm) return;

    const scrollAreaTop = scrollArea.getBoundingClientRect().top;
    const formTop = checkoutForm.getBoundingClientRect().top;
    scrollArea.scrollTo({
      top: scrollArea.scrollTop + formTop - scrollAreaTop - 8,
      behavior: 'smooth'
    });
  });
}

function toggleCart(forceOpen = false) {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  if (forceOpen) {
    drawer.classList.remove('hidden');
  } else {
    drawer.classList.toggle('hidden');
  }
}

function changeCartQty(productId, delta) {
  const item = (appData.cart || []).find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    appData.cart = appData.cart.filter(i => i.id !== productId);
  }

  updateCartUI();
}

function calculateRentalDays() {
  const startInput = document.getElementById('checkout-start-date');
  const endInput = document.getElementById('checkout-end-date');

  const startVal = startInput ? startInput.value : '';
  const endVal = endInput ? endInput.value : '';

  if (!startVal || !endVal) return 1;

  const [sYear, sMonth, sDay] = startVal.split('-').map(Number);
  const [eYear, eMonth, eDay] = endVal.split('-').map(Number);

  const startDate = new Date(sYear, sMonth - 1, sDay);
  const endDate = new Date(eYear, eMonth - 1, eDay);

  const diffTime = endDate - startDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Tanggal mulai dan selesai sama-sama dihitung sebagai hari sewa.
  return diffDays >= 0 ? diffDays + 1 : 1;
}

document.addEventListener('change', (e) => {
  if (e.target && (e.target.id === 'checkout-start-date' || e.target.id === 'checkout-end-date')) {
    updateCartUI();
  }
});

function updateCartUI() {
  const cart = appData.cart || [];
  const container = document.getElementById('cart-items-box');
  const countBadge = document.getElementById('cart-count');
  const totalElem = document.getElementById('cart-total-price');
  const durationLabel = document.getElementById('cart-duration-label');

  const days = calculateRentalDays();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) {
    countBadge.innerText = totalQty;
    countBadge.classList.toggle('hidden', totalQty === 0);
  }

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `<p class="text-center text-slate-400 py-6 text-xs bg-white rounded-xl border border-dashed border-slate-200">Belum ada unit yang dipilih.</p>`;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <img src="${item.image_url || 'https://via.placeholder.com/80'}" class="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-slate-800 text-xs truncate">${item.name}</h4>
            <p class="text-slate-500 text-[10px] mt-0.5">Rp ${item.price.toLocaleString('id-ID')} x ${item.qty} unit / hari</p>
            <p class="text-red-600 font-bold text-xs">Subtotal ${days} hari: Rp ${(item.price * item.qty * days).toLocaleString('id-ID')}</p>
          </div>
          <div class="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
            <button type="button" onclick="changeCartQty(${item.id}, -1)" class="w-5 h-5 font-bold text-xs text-slate-600 hover:text-red-600">-</button>
            <span class="text-xs font-bold text-slate-800 w-4 text-center">${item.qty}</span>
            <button type="button" onclick="changeCartQty(${item.id}, 1)" class="w-5 h-5 font-bold text-xs text-slate-600 hover:text-red-600">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (durationLabel) {
    durationLabel.innerText = `Durasi Sewa: ${days} Hari`;
  }

  if (totalElem) {
    const dailyTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const grandTotal = dailyTotal * days;
    totalElem.innerText = `Rp ${grandTotal.toLocaleString('id-ID')}`;
  }
}

// ==========================================
// 5. CHECKOUT KE DATABASE & WHATSAPP ADMIN
// ==========================================
function handleCheckoutSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('checkout-name')?.value.trim();
  const phoneInput = document.getElementById('checkout-phone')?.value.trim();
  const startDateInput = document.getElementById('checkout-start-date')?.value;
  const endDateInput = document.getElementById('checkout-end-date')?.value;
  const notesInput = document.getElementById('checkout-notes')?.value.trim() || '-';

  if (!appData.cart || appData.cart.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }

  if (!nameInput || !phoneInput || !startDateInput || !endDateInput) {
    alert('Mohon lengkapi Nama, No. WhatsApp, Tanggal Mulai, dan Tanggal Selesai.');
    return;
  }

  if (endDateInput < startDateInput) {
    alert('Tanggal selesai harus sama dengan atau setelah tanggal mulai.');
    return;
  }

  // Buka tab baru seketika saat user klik tombol agar tidak diblokir Pop-up Blocker browser
  const waWindow = window.open('', '_blank');

  const days = calculateRentalDays();
  const dailyTotal = appData.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const grandTotal = dailyTotal * days;

  let itemDetailsText = '';
  appData.cart.forEach((item, index) => {
    const subtotalPerHari = item.price * item.qty;
    const subtotalSewa = subtotalPerHari * days;
    itemDetailsText += `${index + 1}. ${item.name} (${item.qty}x @ Rp ${item.price.toLocaleString('id-ID')}/hari) = Rp ${subtotalSewa.toLocaleString('id-ID')} untuk ${days} hari\n`;
  });

  const orderItemsPayload = appData.cart.map(item => ({
    id: item.id,
    qty: item.qty,
    price: item.price
  }));

  const orderPayload = {
    customer_name: nameInput,
    customer_phone: phoneInput,
    start_date: startDateInput,
    end_date: endDateInput,
    notes: notesInput,
    total_price: grandTotal,
    items: orderItemsPayload
  };

  let orderCode = `RENT-${Date.now().toString().slice(-6)}`;

  // Simpan pesanan ke API sebagai proses latar belakang agar WhatsApp terbuka segera.
  fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(result => {
      if (result.status === 'success') {
        showToast('success', 'Pesanan berhasil disimpan ke database.');
      } else {
        throw new Error(result.message || 'API menolak pesanan.');
      }
    })
    .catch(error => {
      console.error('Pesanan tidak tersimpan ke database:', error);
      showToast('error', 'Pesanan belum tersimpan ke database. Pastikan API Laravel dan MySQL aktif.');
    });

  const waMessage = 
`Halo Admin *MediaRent*, saya ingin mengonfirmasi pesanan sewa berikut:

*No. Pesanan:* ${orderCode}
*Nama / PIC:* ${nameInput}
*No. WA:* ${phoneInput}
*Tanggal Sewa:* ${startDateInput} s/d ${endDateInput} (${days} Hari)

*Rincian Alat yang Disewa:*
${itemDetailsText}
*Total Biaya Estimasi (${days} Hari):* Rp ${grandTotal.toLocaleString('id-ID')}
*Lokasi / Catatan:* ${notesInput}

Mohon konfirmasi ketersediaan unit dan prosedur pengerjaannya. Terima kasih!`;

  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;

  // Reset keranjang & tutup drawer
  appData.cart = [];
  updateCartUI();
  toggleCart();
  document.getElementById('checkout-form')?.reset();

  // Arahkan tab yang sudah dibuka ke URL WhatsApp
  if (waWindow) waWindow.location.href = waUrl;
  else window.location.href = waUrl;
}

// Nama lama tetap didukung untuk tombol checkout yang sudah memakai handler ini.
function kirimPesananWA() {
  const form = document.getElementById('checkout-form');
  if (form && !form.reportValidity()) return;
  handleCheckoutSubmit({ preventDefault() {} });
}

// ==========================================
// 6. PORTOFOLIO, TESTIMONI, BLOG & TOAST
// ==========================================
function renderPortfolios() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  if (!appData.portfolios || appData.portfolios.length === 0) {
    grid.innerHTML = '<div class="text-xs text-slate-400">Belum ada portofolio.</div>';
    return;
  }
  grid.innerHTML = appData.portfolios.map(item => `
    <div class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <img src="${item.gambar}" class="w-full h-44 sm:h-48 object-cover">
      <div class="p-4 space-y-2">
        <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${item.kategori}</span>
        <h3 class="font-bold text-slate-800 text-xs sm:text-sm">${item.judul}</h3>
        <p class="text-xs text-slate-500">${item.deskripsi}</p>
      </div>
    </div>
  `).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-grid') || document.getElementById('testimonial-list');
  if (!container) return;

  const list = appData.testimonials || [];
  if (list.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm">Belum ada ulasan klien.</p>`;
    return;
  }

  container.innerHTML = list.map(item => {
    const nama = item.client_name || item.name || 'Klien MediaRent';
    const event = item.company_or_event || item.role || 'Event Organizer';
    const ulasan = item.review || item.comment || '';
    const rating = Number(item.rating) || 5;
    const stars = '⭐'.repeat(rating);

    return `
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-base">${nama}</h4>
            <p class="text-red-600 font-semibold text-xs">${event}</p>
          </div>
          <div class="text-xs tracking-wider">${stars}</div>
        </div>
        <p class="text-slate-600 text-sm italic">"${ulasan}"</p>
      </div>
    `;
  }).join('');
}

function renderBlogs() {
  const grid = document.getElementById('blog-grid') || document.getElementById('blogs-grid');

  const blogs = (appData.blogs && appData.blogs.length > 0) ? appData.blogs : [
    {
      slug: 'panduan-memilih-ukuran-smart-tv',
      judul: 'Panduan Memilih Ukuran Smart TV Sesuai Luas Booth & Jarak Pandang Audiens',
      kategori: 'Panduan Display',
      ringkasan: 'Tentukan ukuran layar yang pas agar presentasi, video, dan informasi booth mudah dilihat oleh audiens.',
      gambar: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
      isi: [
        'Ukuran layar yang tepat membantu pesan acara terlihat jelas tanpa membuat booth terasa penuh. Sebelum memilih unit, ukur area display dan perkirakan posisi audiens: apakah mereka berdiri dekat meja, mengantre beberapa meter dari layar, atau melihat dari seberang ruangan. Ukuran TV sebaiknya mengikuti kondisi nyata tersebut, bukan hanya luas booth.',
        'TV 32 inci cocok untuk ruang terbatas, meja registrasi, informasi jadwal, atau demo yang ditonton dari jarak dekat. Ukuran ini mudah ditempatkan dan tidak mendominasi dekorasi. Pastikan teks, angka, dan tombol pada konten dibuat cukup besar karena audiens biasanya melihatnya sambil bergerak.',
        'TV sekitar 50 inci menjadi pilihan serbaguna untuk booth menengah dan presentasi yang ditonton beberapa orang sekaligus. Layar ini memberi bidang visual lebih luas untuk video produk, materi promosi, atau dashboard. Sisakan ruang untuk rangka, ventilasi, kabel, dan akses teknisi agar pemasangan tetap rapi.',
        'Untuk area luas, panggung, atau audiens yang melihat dari kejauhan, pertimbangkan TV 65 inci atau lebih besar. Layar besar membantu visual utama lebih mudah dikenali, tetapi tetap perlu diuji dari titik pandang terjauh. Periksa juga kemampuan stand, jalur masuk barang, tinggi pemasangan, dan sumber listrik sebelum hari acara.',
        'Cara paling aman adalah mengirimkan ukuran booth, denah sederhana, foto lokasi, jarak pandang terjauh, dan jenis konten kepada tim penyewaan. Kami dapat membantu mencocokkan ukuran layar dengan tata letak acara. Lakukan uji tayang sebelum acara dimulai agar ukuran tulisan, kecerahan, dan posisi layar nyaman dilihat.'
      ]
    },
    {
      slug: 'solusi-internet-starlink-gen-3',
      judul: 'Solusi Internet Anti-Putus untuk Event Outdoor & Area Minim Sinyal dengan Starlink Gen 3',
      kategori: 'Jaringan & Internet',
      ringkasan: 'Kenali hal yang perlu disiapkan saat menggunakan internet satelit untuk festival, konser, dan proyek lapangan.',
      gambar: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
      isi: [
        'Acara outdoor sering berlangsung di lokasi yang sinyal selulernya terbatas atau berubah-ubah. Starlink Gen 3 dapat menjadi pilihan koneksi berbasis satelit untuk membantu menyediakan internet di lokasi seperti festival, konser, area proyek, dan kegiatan lapangan. Ketersediaan serta performa tetap bergantung pada lokasi, kondisi langit, layanan yang aktif, dan kebutuhan jaringan di acara.',
        'Terminal membutuhkan area dengan pandangan langit yang cukup terbuka. Pepohonan, gedung, panggung, dan struktur sementara dapat menghalangi jalur sinyal. Sebelum acara, tentukan titik pemasangan yang aman dan tidak mengganggu lalu lintas pengunjung. Uji koneksi di posisi tersebut, bukan hanya di area parkir atau titik yang berbeda.',
        'Koneksi internet saja belum menyelesaikan seluruh kebutuhan acara. Hitung perangkat yang akan terhubung, pisahkan jaringan kru dan tamu bila diperlukan, serta tempatkan router di lokasi yang dapat menjangkau area kerja. Untuk live streaming, lakukan uji unggah video dan siapkan koneksi cadangan seperti modem seluler atau rekaman lokal jika jaringan utama terganggu.',
        'Perhatikan juga sumber listrik, perlindungan perangkat dari hujan dan panas, jalur kabel, serta posisi router. Gunakan pelindung dan penataan kabel yang sesuai kondisi venue. Pastikan kru mengetahui siapa yang memantau koneksi dan cara menghubungi teknisi saat terjadi gangguan.',
        'Tidak ada koneksi yang dapat dijamin selalu bebas gangguan. Rencana yang baik dimulai dari survei lokasi, uji beban sesuai kebutuhan, dan pilihan cadangan untuk aktivitas penting. MediaRent dapat membantu menyiapkan unit Starlink Gen 3 dan perangkat jaringan pendukung sesuai kondisi serta kebutuhan acara Anda.'
      ]
    },
    {
      slug: 'kabel-lan-cat6-untuk-event',
      judul: 'Mengapa Kabel LAN Cat6 Wajib Ada untuk Live Streaming dan Presentasi Utama?',
      kategori: 'Tips Teknis',
      ringkasan: 'Koneksi kabel membantu menjaga perangkat penting tetap stabil saat jaringan nirkabel ramai.',
      gambar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      isi: [
        'Wi-Fi praktis untuk mobilitas, tetapi acara besar dapat membuat jaringan nirkabel padat. Banyak ponsel peserta, perangkat kru, dan jaringan dari venue berbagi ruang frekuensi yang sama. Untuk komputer presentasi, encoder streaming, atau perangkat produksi utama, koneksi kabel LAN Cat6 dapat mengurangi ketergantungan pada kondisi sinyal Wi-Fi.',
        'Kabel memberi jalur koneksi langsung antara perangkat dan router atau switch. Hasilnya lebih konsisten untuk perangkat yang tidak perlu berpindah tempat, serta membantu mengurangi gangguan yang berasal dari jarak, dinding, dan kepadatan jaringan nirkabel. Ini berguna ketika presentasi utama sedang berlangsung atau siaran langsung tidak boleh mudah terputus.',
        'Rencanakan jalur kabel sebelum dekorasi dan penonton memenuhi area. Ukur jarak dari perangkat ke titik jaringan, hindari jalur pintu dan area yang sering diinjak, lalu gunakan pelindung kabel bila melintasi jalur orang. Beri label pada kedua ujung kabel agar kru dapat mengenali sambungan saat perlu melakukan pengecekan.',
        'Cat6 bukan pengganti seluruh perencanaan jaringan. Router, switch, konfigurasi, sumber internet, dan kapasitas layanan tetap memengaruhi hasil. Untuk perangkat bergerak, Wi-Fi masih berguna; gunakan kabel untuk perangkat tetap dan aktivitas prioritas. Pisahkan jaringan tamu dari jaringan produksi bila perangkat dan konfigurasi mendukung.',
        'Sebelum acara dibuka, lakukan uji presentasi dan streaming menggunakan konfigurasi yang sama dengan saat acara berlangsung. Periksa konektor, jalur kabel, serta kestabilan koneksi selama beberapa menit. Dengan menyiapkan kabel LAN Cat6 dan rute cadangan, kru dapat mengurangi risiko gangguan teknis di momen penting.'
      ]
    },
    {
      slug: 'keuntungan-menyewa-peralatan-multimedia',
      judul: 'Keuntungan Menyewa Peralatan Multimedia Dibanding Membeli untuk Kebutuhan Event Berkala',
      kategori: 'Tips Perencanaan Event',
      ringkasan: 'Bandingkan biaya, penyimpanan, perawatan, dan dukungan teknisi sebelum menentukan kebutuhan perangkat.',
      gambar: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      isi: [
        'Membeli TV, touchscreen, router, dan perlengkapan event dapat terasa praktis jika perangkat digunakan terus-menerus. Namun untuk acara yang berlangsung berkala, keputusan tersebut perlu memperhitungkan biaya pembelian, penyimpanan, perawatan, transportasi, dan waktu kru untuk menyiapkan peralatan.',
        'Menyewa membantu mengubah sebagian biaya awal menjadi biaya sesuai kebutuhan acara. Anda dapat memilih ukuran layar dan jenis perangkat yang berbeda untuk setiap venue atau konsep. Acara kecil mungkin cukup memakai TV berukuran sedang, sementara pameran besar membutuhkan beberapa layar, touchscreen, atau jaringan tambahan.',
        'Penyewaan juga mengurangi kebutuhan ruang penyimpanan dan pengelolaan inventaris. Perangkat multimedia perlu diperiksa, dikemas, diangkut, disambungkan, lalu dirawat setelah acara. Dengan layanan sewa, tim dapat membahas kebutuhan unit dan jadwal pengiriman lebih dulu sehingga persiapan internal lebih terarah.',
        'Dukungan teknisi di lokasi dapat membantu proses pemasangan dan penanganan kendala. Pastikan cakupan layanan dijelaskan sejak awal: apakah termasuk pengiriman, instalasi, operator, kabel, stand, atau dukungan selama acara. Rincian ini membantu membandingkan penawaran dengan kebutuhan sebenarnya.',
        'Membeli tetap dapat masuk akal jika perangkat dipakai sangat sering, spesifikasinya konsisten, dan organisasi siap menangani perawatan serta penyimpanan. Untuk menentukan pilihan, catat frekuensi pemakaian, total biaya kepemilikan, kebutuhan tiap acara, dan konsekuensi jika perangkat mengalami gangguan. MediaRent dapat membantu menyusun daftar unit sewaan sesuai skala dan jadwal event Anda.'
      ]
    }
  ];

  window.MEDIARENT_BLOGS = blogs;
  if (!grid) return;

  grid.innerHTML = blogs.map(b => `
    <div class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <img src="${b.gambar}" alt="${b.judul}" class="w-full h-44 object-cover">
      <div class="p-4 space-y-3 flex-1">
        <span class="text-[10px] font-bold text-red-600">${b.kategori}</span>
        <h3 class="font-bold text-slate-800 text-base leading-snug">${b.judul}</h3>
        <p class="text-xs text-slate-500 line-clamp-3">${b.ringkasan}</p>
        <a href="artikel.html?slug=${encodeURIComponent(b.slug || '')}" class="inline-flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-bold text-brandRed hover:text-brandRedHover">
          Baca artikel lengkap <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join('');
}

function openTestiModal() { document.getElementById('testi-modal')?.classList.remove('hidden'); }
function closeTestiModal() { document.getElementById('testi-modal')?.classList.add('hidden'); }

function handleTestiSubmit(e) {
  e.preventDefault();
  const newTesti = {
    client_name: document.getElementById('t-nama').value,
    company_or_event: document.getElementById('t-perusahaan').value || '-',
    rating: parseInt(document.getElementById('t-rating').value),
    review: document.getElementById('t-komentar').value
  };
  appData.testimonials.unshift(newTesti);
  renderTestimonials();
  closeTestiModal();
  showToast('success', 'Terima kasih atas ulasan Anda!');
}

function showToast(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const icons = { success: 'fa-circle-check text-red-600', error: 'fa-circle-xmark text-rose-500', info: 'fa-circle-info text-sky-500' };
  toast.className = `pointer-events-auto flex items-center gap-3 bg-white border-l-4 border-red-600 shadow-lg rounded-xl p-4 text-slate-700 text-xs transition duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info} text-lg"></i><div class="flex-1 font-medium">${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
  setTimeout(() => { toast.classList.add('opacity-0', 'translate-y-2'); setTimeout(() => toast.remove(), 300); }, 4000);
}
