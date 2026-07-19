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
      });
    });

    /* content hub: pinned videos first, then the rest in reverse-chronological order */
    var hubVideos = [
      { id: 'Ssd0JCHDUVg', title: 'Kamera Önünde Rahat Konuşmanın Gerçek Sırrı | Dijital Muhabirin Sistemi', date: '2026-05-31', pinned: true, thumb: 'assets/images/hub-dijital-muhabirin-sistemi.jpg' },
      { id: 'lyptBhqZGro', title: 'GMC Summit Day 1 | Müslüman Medyasının Geleceği, Yapay Zeka ve İçerik Üretimi', date: '2026-07-11', pinned: false, thumb: 'assets/images/hub-gmc-summit.jpg' },
      { id: 'rQ5nJ5Fu5xo', title: 'Bu köy gerçek mi? Sizi Avusturya’nın rüya köyü Irschen’e götürüyorum', date: '2026-07-08', pinned: false, thumb: 'assets/images/hub-avusturya-koyu-kisa.jpg' },
      { id: 'cDVYzKQLVXs', title: 'AVUSTURYA VLOG: Alplerde Saklı Bir Avusturya Köyüne Gittim', date: '2026-07-07', pinned: false, thumb: 'assets/images/hub-avusturya-vlog.jpg' },
      { id: 'Gyr0-eak_vc', title: 'Muhabirler Kamera Karşısında Nasıl Bu Kadar Rahat?', date: '2026-06-01', pinned: false, thumb: 'assets/images/hub-muhabirler-kamera.jpg' },
      { id: 'Rek4wUaeNT4', title: 'Anadolu Ajansı Yönetim Kurulu Başkanı ve Genel Müdürü Sayın Serdar Karagöz özel röportajı', date: '2026-01-06', pinned: false, thumb: 'assets/images/hub-serdar-karagoz-roportaj.jpg' }
    ];

    function formatHubDate(iso) {
      var d = new Date(iso + 'T00:00:00');
      var dd = String(d.getDate()).padStart(2, '0');
      var mm = String(d.getMonth() + 1).padStart(2, '0');
      return dd + '.' + mm + '.' + d.getFullYear();
    }

    function renderHub() {
      var grid = document.getElementById('hubGrid');
      if (!grid) return;
      var sorted = hubVideos.slice().sort(function (a, b) {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.date) - new Date(a.date);
      });
      var pinLabel = currentLang === 'tr' ? 'Sabitlendi' : 'Pinned';
      grid.innerHTML = sorted.map(function (v) {
        return '<a class="hub-tile" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener noreferrer" aria-label="' + v.title.replace(/"/g, '&quot;') + ' videosunu YouTube\'da izle">' +
          '<div class="hub-thumb" style="background-image:url(' + v.thumb + ')">' +
            (v.pinned ? '<span class="hub-pin">' + pinLabel + '</span>' : '') +
            '<span class="play-icon" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="hub-body">' +
            '<p class="hub-title">' + v.title + '</p>' +
            '<p class="hub-date">' + formatHubDate(v.date) + '</p>' +
          '</div>' +
        '</a>';
      }).join('');
    }
    renderHub();

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
      var heroSection = document.querySelector('.hero-plain');
      if (glow && heroSection) {
        var ticking = false;
        window.addEventListener('scroll', function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            var rect = heroSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              var offset = (rect.top || 0) * 0.12;
              glow.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
            }
            ticking = false;
          });
        }, { passive: true });
      }
    }
  })();
