# Utility Components

Folder ini berisi komponen-komponen utilitas yang digunakan dalam aplikasi Money Tracker.

## Komponen

- `Accordion.jsx` - Komponen accordion untuk menampilkan konten yang dapat dibuka/tutup
- `Badge.jsx` - Komponen badge untuk menampilkan label atau indikator
- `Divider.jsx` - Komponen pembatas/divider untuk memisahkan konten
- `LoadingSpinner.jsx` - Komponen spinner untuk menampilkan indikator loading
- `Tooltip.jsx` - Komponen tooltip untuk menampilkan informasi tambahan

## Penggunaan

Komponen-komponen ini dapat diimpor dari `../components/auth` melalui file index.js.

```jsx
import { Accordion, AccordionItem, Badge, Tooltip } from '../components/auth';
```

### Contoh Penggunaan Accordion

```jsx
<Accordion>
  <AccordionItem id="item1" title="Item 1">
    Konten Item 1
  </AccordionItem>
  <AccordionItem id="item2" title="Item 2">
    Konten Item 2
  </AccordionItem>
</Accordion>
```