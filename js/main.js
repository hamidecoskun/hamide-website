(function () {
    var burger = document.getElementById('burgerBtn');
    var panel = document.getElementById('mobilePanel');
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });

    var langButtons = document.querySelectorAll('.lang-toggle button');
    var currentLang = 'tr';
    langButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        currentLang = lang;
        langButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
          el.innerHTML = el.getAttribute('data-' + lang);
        });
        renderHub();
        renderInstagram();
      });
    });

    /* content hub: works come from content/works.json — pinned first, then newest first */
    var hubVideos = [];
    var hubSeries = [];

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

    function formatHubDate(iso) {
      var d = new Date(iso + 'T00:00:00');
      var dd = String(d.getDate()).padStart(2, '0');
      var mm = String(d.getMonth() + 1).padStart(2, '0');
      return dd + '.' + mm + '.' + d.getFullYear();
    }

    function tile(v) {
      var pinLabel = currentLang === 'tr' ? 'Sabitlendi' : 'Pinned';
      return '<a class="hub-tile" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(v.title) + '">' +
        '<div class="hub-thumb"' + (v.thumb ? ' style="background-image:url(' + esc(v.thumb) + ')"' : '') + '>' +
          (v.pinned ? '<span class="hub-pin">' + pinLabel + '</span>' : '') +
          '<span class="play-icon" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="hub-body">' +
          '<p class="hub-title">' + esc(v.title) + '</p>' +
          '<p class="hub-date">' + formatHubDate(v.date) + '</p>' +
        '</div>' +
      '</a>';
    }

    function byNewest(a, b) { return new Date(b.date) - new Date(a.date); }

    var igPosts = [];
    var igProfile = 'https://www.instagram.com/hamide.cskn/';

    function igNormalize(raw) {
      var list = Array.isArray(raw) ? raw : (raw && (raw.posts || raw.data || raw.items)) || [];
      if (!Array.isArray(list)) list = [];
      return list.map(function (o) {
        var sizes = o.sizes || {};
        var sized = (sizes.medium && (sizes.medium.mediaUrl || sizes.medium.url)) ||
                    (sizes.small && (sizes.small.mediaUrl || sizes.small.url)) || '';
        return {
          url: o.permalink || o.link || o.url || igProfile,
          thumb: sized || o.thumbnailUrl || o.thumbnail || o.image || o.thumb || o.mediaUrl || o.media_url || '',
          caption: o.prunedCaption || o.caption || o.title || o.text || '',
          date: (o.timestamp || o.date || o.publishedAt || '').toString().slice(0, 10)
        };
      }).filter(function (o) { return o.url; });
    }

    function igTile(p) {
      var cap = p.caption.replace(/\s+/g, ' ').trim();
      if (cap.length > 96) cap = cap.slice(0, 96).replace(/\S*$/, '') + '…';
      return '<a class="ig-tile" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram gönderisi">' +
        '<div class="ig-thumb"' + (p.thumb ? ' style="background-image:url(' + esc(p.thumb) + ')"' : ' data-empty="1"') + '></div>' +
        (cap ? '<p class="ig-cap">' + esc(cap) + '</p>' : '') +
        (p.date ? '<p class="hub-date">' + formatHubDate(p.date) + '</p>' : '') +
      '</a>';
    }

    function renderInstagram() {
      var sec = document.getElementById('instagram');
      var grid = document.getElementById('igGrid');
      if (!sec || !grid) return;
      if (!igPosts.length) { sec.style.display = 'none'; return; }
      sec.style.display = '';
      grid.innerHTML = igPosts.slice(0, 8).map(igTile).join('');
    }


    function renderHub() {
      var grid = document.getElementById('hubGrid');
      if (grid) {
        var sorted = hubVideos.slice().sort(function (a, b) {
          if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
          return byNewest(a, b);
        });
        grid.innerHTML = sorted.map(tile).join('');
      }
      var list = document.getElementById('seriesList');
      if (list) {
        var soon = currentLang === 'tr' ? 'Yakında' : 'Coming soon';
        list.innerHTML = hubSeries.map(function (s) {
          var items = hubVideos.filter(function (v) { return v.series === s.id; }).sort(byNewest);
          return '<div class="series-row">' +
            '<div class="series-head">' +
              '<h3 class="series-name">' + esc(s.name) + '</h3>' +
              '<p class="series-desc">' + esc(currentLang === 'tr' ? s.tr : s.en) + '</p>' +
            '</div>' +
            (items.length ? '<div class="hub-grid">' + items.map(tile).join('') + '</div>' : '<p class="series-soon">' + soon + '</p>') +
          '</div>';
        }).join('');
      }
    }

    fetch('content/works.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        hubVideos = data.works || [];
        hubSeries = data.series || [];
        renderHub();

        var ig = data.instagram || {};
        if (ig.profil) igProfile = ig.profil;
        var link = document.getElementById('igProfileLink');
        if (link) link.href = igProfile;
        igPosts = igNormalize(ig.posts || []);
        renderInstagram();
        if (ig.feedUrl) {
          fetch(ig.feedUrl, { cache: 'no-cache' })
            .then(function (r) { return r.json(); })
            .then(function (feed) {
              var live = igNormalize(feed);
              if (live.length) { igPosts = live; renderInstagram(); }
            })
            .catch(function () {});
        }
      })
      .catch(function () {});

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { obs.observe(el); });

      var glow = document.getElementById('heroGlow');
      var lens = document.getElementById('heroLens');
      var heroSection = document.querySelector('.hero-plain');
      if (glow && heroSection) {
        var ticking = false;
        window.addEventListener('scroll', function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            var rect = heroSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              var top = rect.top || 0;
              glow.style.transform = 'translateY(' + (top * 0.12).toFixed(1) + 'px)';
              if (lens) {
                lens.style.transform = 'translateY(' + (top * 0.05).toFixed(1) + 'px)';
                var progress = Math.min(Math.max(-top / 260, 0), 1);
                lens.style.opacity = (progress * 0.4).toFixed(2);
              }
            }
            ticking = false;
          });
        }, { passive: true });
      }
    }
  })();
