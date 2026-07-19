# Hamide Coşkun — Kişisel Site

Statik bir HTML/CSS/JS sitesi. Hiçbir build adımı gerekmez.

## Yapı

```
index.html
css/style.css
js/main.js
assets/fonts/      (Fraunces + Inter, woff2)
assets/images/     (story ve video thumbnail görselleri)
```

## Yerelde önizleme

En kolay yol, bir yerel sunucu başlatmak (dosyayı doğrudan çift tıklayıp açmak fontları/görselleri bazı tarayıcılarda engelleyebilir):

```bash
cd /Users/hamidecoskun/Desktop/WEB
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç.

## GitHub'a yükleme

```bash
cd /Users/hamidecoskun/Desktop/WEB
git init
git add .
git commit -m "İlk sürüm"
git branch -M main
git remote add origin <senin-repo-linkin>
git push -u origin main
```

## Vercel'e yayınlama

1. [vercel.com](https://vercel.com) hesabınla giriş yap.
2. "Add New Project" → GitHub reponu seç.
3. Framework olarak "Other" / "Static" seçili kalsın, build komutu gerekmez.
4. Deploy'a bas.

Site birkaç saniyede `senin-proje-adi.vercel.app` adresinde canlı olur. Kendi alan adını daha sonra Vercel proje ayarlarından bağlayabilirsin.
