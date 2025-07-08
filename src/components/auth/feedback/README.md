# Feedback Components

Folder ini berisi komponen-komponen feedback yang digunakan dalam aplikasi Money Tracker.

## Komponen

- `AlertMessage.jsx` - Komponen untuk menampilkan pesan alert
- `Modal.jsx` - Komponen dialog modal untuk menampilkan informasi atau konfirmasi
- `PasswordStrengthMeter.jsx` - Komponen untuk menampilkan kekuatan password

## Penggunaan

Komponen-komponen ini dapat diimpor dari `../components/auth` melalui file index.js.

```jsx
import { AlertMessage, Modal, PasswordStrengthMeter } from '../components/auth';
```

### Contoh Penggunaan AlertMessage

```jsx
<AlertMessage 
  type="success" 
  message="Operasi berhasil dilakukan!" 
  dismissible={true} 
/>
```