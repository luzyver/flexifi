# Navigation Components

Folder ini berisi komponen-komponen navigasi yang digunakan dalam aplikasi Money Tracker.

## Komponen

- `Tabs.jsx` - Komponen tab untuk navigasi antar konten dalam satu halaman
- `Pagination.jsx` - Komponen pagination untuk navigasi antar halaman data
- `Breadcrumb.jsx` - Komponen breadcrumb untuk menampilkan hierarki navigasi

## Penggunaan

Komponen-komponen ini dapat diimpor dari `../components/auth` melalui file index.js.

```jsx
import { Tabs, TabItem, Pagination, Breadcrumb } from '../components/auth';
```

### Contoh Penggunaan Tabs

```jsx
<Tabs activeKey={activeTab} onSelect={setActiveTab}>
  <TabItem id="tab1" title="Tab 1">
    Konten Tab 1
  </TabItem>
  <TabItem id="tab2" title="Tab 2">
    Konten Tab 2
  </TabItem>
</Tabs>
```