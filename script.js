// ── CATEGORY DATA ──────────────────────────────────────────────────────────────
const categories = [
  {
    title: "Manga Through the Years",
    desc: "My manga which I started drawing at 15 — and have been redrawing every few years to see how much (or how little) I've changed. It's a personal time capsule.",
    count: 3, spoiler: false, hasVideo: false
  },
  {
    title: "Panelling & Doodles",
    desc: "I still love panelling, so I doodle them sometimes. Also contains evidence of my ongoing inner fight with my OC about One Piece.",
    count: 5, spoiler: false, hasVideo: false
  },
  {
    title: "OCs for Friends & Fandoms",
    desc: "Original characters I made for friends and myself for specific fandoms. Every one of them has way more lore than I intended.",
    count: 6, spoiler: false, hasVideo: false
  },
  {
    title: "Fanart",
    desc: "I'm fine with fanart, though I don't change much from the source — I keep it simple and easy. For some reason it's a lot of Haikyuu. (I have no regrets.)",
    count: 3, spoiler: false, hasVideo: false
  },
  {
    title: "Shikishi Boards",
    desc: "I like drawing on shikishi boards — though they're rather expensive in Germany, 5€ for a single board. Worth it every time.",
    count: 3, spoiler: false, hasVideo: false
  },
  {
    title: "School & Cropped Work",
    desc: "These are cropped since some have my real name on them, and were school projects. A sin to stop drawing like this — but I will practice more.",
    count: 2, spoiler: false, hasVideo: false
  },
  {
    title: "Story OCs (Unfinished Tales)",
    desc: "My other OCs from stories I never continued beyond the premise. They deserved more and I still feel guilty about it.",
    count: 2, spoiler: false, hasVideo: false
  },
  {
    title: "Style Studies & Goofing Around",
    desc: "I goof around and try out styles, as well as study. Most of the nicer backgrounds aren't made by me — I use CSP assets.",
    count: 3, spoiler: false, hasVideo: false
  },
  {
    title: "Stickers & GIFs",
    desc: "I can make simple stickers and GIFs and did so for WhatsApp. Other platforms should work too — tiny art, big feelings.",
    count: 4, spoiler: false, hasVideo: false
  },
  {
    title: "Idol OCs & Their Chaos",
    desc: "My biggest lore project — my idol OCs and them being total idiots. This started innocently. It did not stay innocent.",
    count: 8, spoiler: false, hasVideo: false
  },
  {
    title: "The Escape Game & More",
    desc: "I made a small visual novel where the idiots are in a Halloween-themed escape game. Scary sprites are marked spoiler. Also: their signatures and mascot characters — which was a completely different challenge for me.",
    count: 5, spoiler: false, hasVideo: false
  },
  {
    title: "Progress & Process",
    desc: "Progress examples showing how things evolved. This category may include videos — because sometimes a timelapse says more than any before/after.",
    count: 3, spoiler: false, hasVideo: false
  },
  {
    title: "My all time favorites",
    desc: "My 19 year old self peaked with realism !!",
    count: 6, spoiler: false, hasVideo: false
  }
];

// ── BUILD SLIDERS ──────────────────────────────────────────────────────────────

// Helper function to load media with automatic type detection (sequential, first success wins)
function loadMediaWithFallback(basePath, callback) {
  const candidates = [
    {ext: '.jpg', type: 'image'},
    {ext: '.jpeg', type: 'image'},
    {ext: '.png', type: 'image'},
    {ext: '.gif', type: 'image'},
    {ext: '.webp', type: 'image'},
    {ext: '.mp4', type: 'video'},
    {ext: '.webm', type: 'video'},
    {ext: '.ogg', type: 'video'},
    {ext: '.mov', type: 'video'},
    {ext: '.avi', type: 'video'}
  ];

  let i = 0;

  const tryNext = () => {
    if (i >= candidates.length) {
      callback(null);
      return;
    }

    const candidate = candidates[i];
    const url = basePath + candidate.ext;

    if (candidate.type === 'image') {
      const img = new Image();
      img.onload = () => callback({ type: 'image', element: img });
      img.onerror = () => {
        i += 1;
        tryNext();
      };
      img.src = url;
    } else {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => callback({ type: 'video', element: video });
      video.onerror = () => {
        i += 1;
        tryNext();
      };
      video.src = url;
      video.load();
    }
  };

  tryNext();
}

const container = document.getElementById('categoryContainer');

categories.forEach((cat, ci) => {
  const block = document.createElement('div');
  block.className = 'category-block reveal';

  // Header
  block.innerHTML = `
    <div class="category-header">
      <span class="cat-num">${String(ci + 1).padStart(2, '0')}</span>
      <div class="cat-info">
        <h3>${cat.title}</h3>
        <p>${cat.desc}</p>
      </div>
    </div>
  `;

  // Slider
  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'slider-wrap';

  const outer = document.createElement('div');
  outer.className = 'slider-track-outer';

  const track = document.createElement('div');
  track.className = 'slider-track';
  track.dataset.offset = '0';

  for (let i = 0; i < cat.count; i++) {
    const isSpoiler = cat.spoiler && i >= cat.count - 2;

    const item = document.createElement('div');
    item.className = 'slide-item';

    // Load media with automatic type detection
    loadMediaWithFallback(`images/${ci + 1}-${i + 1}`, (media) => {
      if (!media) {
        item.classList.add('media-missing');
        item.innerHTML = '<div class="slide-placeholder"><span>Missing media</span></div>';
        return;
      }

      if (media.type === 'image') {
        const img = media.element;
        img.alt = `${cat.title} - Item ${i + 1}`;
        img.loading = 'lazy';
        item.appendChild(img);
        item.classList.add('image-item');
      } else if (media.type === 'video') {
        const video = media.element;
        video.controls = false;
        video.muted = true;
        video.loop = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        item.appendChild(video);
        item.classList.add('video-item');

        // Add play/pause on click for videos
        item.addEventListener('click', (e) => {
          if (e.target === video) {
            e.stopPropagation();
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
        });
      }
    });

    if (isSpoiler) {
      const overlay = document.createElement('div');
      overlay.className = 'spoiler-overlay';
      overlay.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        <span>Spoiler</span>
        <small>click to reveal</small>
      `;
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.classList.add('revealed');
      });
      item.appendChild(overlay);
    }

    // Lightbox click
    item.addEventListener('click', () => {
      const overlay = item.querySelector('.spoiler-overlay');
      if (overlay && !overlay.classList.contains('revealed')) return;

      // Find the media element (img or video)
      const mediaElement = item.querySelector('img, video');
      if (mediaElement) {
        openLightbox(mediaElement);
      }
    });

    track.appendChild(item);
  }

  outer.appendChild(track);
  sliderWrap.appendChild(outer);

  // Buttons (if phone => always show; else show only if overflow by visible count)
  const btnPrev = document.createElement('button');
  btnPrev.className = 'slider-btn prev';
  btnPrev.setAttribute('aria-label', 'Previous');
  btnPrev.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`;

  const btnNext = document.createElement('button');
  btnNext.className = 'slider-btn next';
  btnNext.setAttribute('aria-label', 'Next');
  btnNext.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`;

  let offset = 0;

  function getItemWidth() {
    const item = track.querySelector('.slide-item');
    if (!item) return 0;
    const gap = parseInt(getComputedStyle(track).gap, 10) || 16;
    return item.offsetWidth + gap;
  }

  function getVisibleCount() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 4;
  }

  function needsSlider() {
    if (window.innerWidth <= 560) return true;
    return cat.count > getVisibleCount();
  }

  function slide(dir) {
      const visible = getVisibleCount();
      const step = visible;
      const max = Math.max(0, cat.count - visible);
      offset = Math.min(Math.max(offset + dir * step, 0), max);
      const px = offset * getItemWidth();
      track.style.transform = `translateX(-${px}px)`;

      btnPrev.disabled = offset <= 0;
      btnNext.disabled = offset >= max;
      btnPrev.style.visibility = btnPrev.disabled ? 'hidden' : 'visible';
      btnNext.style.visibility = btnNext.disabled ? 'hidden' : 'visible';
    }

    function updateButtonVisibility() {
      const visible = getVisibleCount();
      const shouldShow = needsSlider();

      btnPrev.style.display = shouldShow ? 'block' : 'none';
      btnNext.style.display = shouldShow ? 'block' : 'none';

      if (shouldShow) {
        const max = Math.max(0, cat.count - visible);
        const leftDisabled = offset <= 0;
        const rightDisabled = offset >= max;

        btnPrev.disabled = leftDisabled;
        btnNext.disabled = rightDisabled;
        btnPrev.style.visibility = leftDisabled ? 'hidden' : 'visible';
        btnNext.style.visibility = rightDisabled ? 'hidden' : 'visible';
      } else {
        btnPrev.style.visibility = 'hidden';
        btnNext.style.visibility = 'hidden';
      }
    }
  window.addEventListener('resize', () => {
    offset = 0;
    track.style.transform = 'translateX(0)';
    updateButtonVisibility();
  });

  btnPrev.addEventListener('click', () => slide(-1));
  btnNext.addEventListener('click', () => slide(1));

  sliderWrap.appendChild(btnPrev);
  sliderWrap.appendChild(btnNext);

  updateButtonVisibility();

  block.appendChild(sliderWrap);
  container.appendChild(block);
});

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
// (placeholder version: opens with a generated data-URI canvas art)
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');

function openLightbox(mediaElement) {
  // Clear previous content
  lbImg.style.display = 'none';
  const existingVideo = lightbox.querySelector('video');
  if (existingVideo) {
    existingVideo.remove();
  }

  if (mediaElement.tagName === 'IMG') {
    // Show image in lightbox
    lbImg.src = mediaElement.src;
    lbImg.alt = mediaElement.alt;
    lbImg.style.display = 'block';
  } else if (mediaElement.tagName === 'VIDEO') {
    // Clone and show video in lightbox
    const videoClone = mediaElement.cloneNode(true);
    videoClone.controls = true;
    videoClone.style.maxWidth = '90vw';
    videoClone.style.maxHeight = '90vh';
    videoClone.style.display = 'block';
    lightbox.insertBefore(videoClone, lbClose.nextSibling);
    videoClone.play();
  }

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';

  // Pause and remove any video in lightbox
  const videoInLightbox = lightbox.querySelector('video');
  if (videoInLightbox) {
    videoInLightbox.pause();
    videoInLightbox.remove();
  }

  // Reset image display
  lbImg.style.display = 'block';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ── REAL IMAGE SUPPORT ────────────────────────────────────────────────────────
// To add real images: replace the slide-item click handler above, or
// set item.dataset.src = "your-image.jpg" and update openLightbox to use it.

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${i * 0.05}s`;
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── PAINTBRUSH CURSOR + SAKURA TRAIL ─────────────────────────────────────────
(function () {
  const wrap = document.getElementById('cursor-wrap');
  document.addEventListener('mousemove', e => {
    wrap.style.left = e.clientX + 'px';
    wrap.style.top  = e.clientY + 'px';
  });

  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#c084a8','#9b6bb5','#d9a8cc','#b07acc','#e8c8f0','#7a5aa0','#f0d4f8'];
  const SIZES  = [7, 10, 13, 16];

  function makePetal(color, size) {
    const oc = document.createElement('canvas');
    oc.width = oc.height = size * 2;
    const ox = oc.getContext('2d');
    ox.save(); ox.translate(size, size);
    ox.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const bx = Math.cos(a) * size * .95, by = Math.sin(a) * size * .95;
      const cp1x = Math.cos(a-.5)*size*1.2, cp1y = Math.sin(a-.5)*size*1.2;
      const cp2x = Math.cos(a+.5)*size*1.2, cp2y = Math.sin(a+.5)*size*1.2;
      if (i===0) ox.moveTo(bx,by); else ox.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,bx,by);
    }
    ox.closePath();
    const g = ox.createRadialGradient(0,-size*.2,0,0,0,size);
    g.addColorStop(0,'#fff'); g.addColorStop(.3,color); g.addColorStop(1,color+'88');
    ox.fillStyle = g; ox.fill();
    ox.beginPath(); ox.arc(0,0,size*.18,0,Math.PI*2);
    ox.fillStyle='#f0e8f8'; ox.fill();
    ox.restore();
    return oc;
  }

  const sprites = [];
  COLORS.forEach(c => SIZES.forEach(s => sprites.push(makePetal(c, s))));
  const randSprite = () => sprites[Math.floor(Math.random() * sprites.length)];

  const particles = [];
  class Petal {
    constructor(x, y) {
      this.sprite = randSprite();
      this.x = x + (Math.random()-.5)*18; this.y = y + (Math.random()-.5)*18;
      this.vx = (Math.random()-.5)*2.2; this.vy = -(Math.random()*2.4+.7);
      this.grav = Math.random()*.08+.04; this.rot = Math.random()*Math.PI*2;
      this.rspd = (Math.random()-.5)*.11; this.alpha = 1;
      this.fade = Math.random()*.025+.015; this.scale = Math.random()*.5+.5;
      this.swing = Math.random()*.025; this.swingT = Math.random()*Math.PI*2;
    }
    update() {
      this.swingT+=.05; this.vx+=Math.sin(this.swingT)*this.swing;
      this.vy+=this.grav; this.x+=this.vx; this.y+=this.vy;
      this.rot+=this.rspd; this.alpha-=this.fade;
    }
    draw(ctx) {
      if (this.alpha<=0) return;
      const s = this.sprite.width/2;
      ctx.save(); ctx.globalAlpha=Math.max(0,this.alpha);
      ctx.translate(this.x,this.y); ctx.rotate(this.rot); ctx.scale(this.scale,this.scale);
      ctx.drawImage(this.sprite,-s,-s); ctx.restore();
    }
    get dead() { return this.alpha<=0 || this.y>canvas.height+40; }
  }

  let lastX=-999, lastY=-999;
  document.addEventListener('mousemove', e => {
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if (dist>4) {
      lastX=e.clientX; lastY=e.clientY;
      const count=Math.min(Math.floor(dist/5)+1,5);
      for (let i=0;i<count;i++) {
        const t=i/count;
        particles.push(new Petal(e.clientX-dx*t, e.clientY-dy*t));
      }
    }
  });

  (function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i=particles.length-1;i>=0;i--) {
      particles[i].update(); particles[i].draw(ctx);
      if (particles[i].dead) particles.splice(i,1);
    }
    requestAnimationFrame(loop);
  })();
})();
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
