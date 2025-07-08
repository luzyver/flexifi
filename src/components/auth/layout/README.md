# Layout Components

Folder ini berisi komponen-komponen layout yang digunakan dalam aplikasi Money Tracker.

## Komponen

- `AuthLayout.jsx` - Komponen layout utama untuk halaman autentikasi
- `AuthHeader.jsx` - Komponen header untuk halaman autentikasi
- `AuthFooter.jsx` - Komponen footer untuk halaman autentikasi
- `AuthCard.jsx` - Komponen kartu untuk halaman autentikasi
- `Card.jsx` - Komponen kartu umum yang dapat digunakan di berbagai halaman
- `FeatureList.jsx` - Komponen untuk menampilkan daftar fitur pada halaman autentikasi
- `SecurityNotice.jsx` - Komponen untuk menampilkan pemberitahuan keamanan

## Penggunaan

Komponen-komponen ini dapat diimpor dari `../components/auth` melalui file index.js.

```jsx
import { AuthLayout, AuthHeader, Card } from '../components/auth';
```