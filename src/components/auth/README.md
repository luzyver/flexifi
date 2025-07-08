# Auth Components

Folder ini berisi komponen-komponen UI yang digunakan dalam aplikasi Money Tracker, terutama untuk halaman autentikasi dan komponen UI yang dapat digunakan kembali di seluruh aplikasi.

## Struktur Folder

- `buttons/` - Komponen-komponen button (SubmitButton, LinkButton, dll)
- `feedback/` - Komponen-komponen feedback (AlertMessage, Modal, dll)
- `form/` - Komponen-komponen form (FormInput, FormGroup, dll)
- `layout/` - Komponen-komponen layout (AuthLayout, Card, dll)
- `navigation/` - Komponen-komponen navigasi (Tabs, Pagination, dll)
- `utils/` - Komponen-komponen utilitas (Accordion, Badge, dll)

## Penggunaan

Semua komponen dapat diimpor dari `../components/auth` melalui file index.js.

```jsx
import { 
  // Layout
  AuthLayout, Card,
  
  // Form
  FormInput, FormGroup,
  
  // Buttons
  SubmitButton, LinkButton,
  
  // Navigation
  Tabs, TabItem, Pagination,
  
  // Feedback
  AlertMessage, Modal,
  
  // Utils
  Accordion, Badge, Tooltip
} from '../components/auth';
```

## Keuntungan Struktur Folder

1. **Organisasi yang Lebih Baik** - Komponen dikelompokkan berdasarkan fungsinya
2. **Pemeliharaan yang Lebih Mudah** - Lebih mudah menemukan dan memperbarui komponen
3. **Reusabilitas** - Komponen dirancang untuk dapat digunakan kembali di seluruh aplikasi
4. **Konsistensi** - Memastikan konsistensi UI di seluruh aplikasi