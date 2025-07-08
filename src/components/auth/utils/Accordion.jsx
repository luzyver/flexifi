import React, { useState } from 'react';

/**
 * AccordionItem - Komponen untuk item accordion
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk item
 * @param {string} props.title - Judul item
 * @param {React.ReactNode} props.children - Konten item
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {boolean} props.disabled - Apakah item dinonaktifkan
 * @param {boolean} props.defaultOpen - Apakah item terbuka secara default
 */
export const AccordionItem = ({ children }) => {
  return children;
};

/**
 * Accordion - Komponen untuk menampilkan konten yang dapat dikolapskan
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Komponen AccordionItem
 * @param {string} props.id - ID unik untuk accordion
 * @param {boolean} props.flush - Apakah accordion tanpa border dan background
 * @param {boolean} props.alwaysOpen - Apakah multiple item dapat terbuka bersamaan
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 */
const Accordion = ({
  children,
  id = 'accordion',
  flush = false,
  alwaysOpen = false,
  className = '',
  style = {}
}) => {
  // State untuk item yang terbuka
  const [openItems, setOpenItems] = useState([]);
  
  // Ekstrak data item dari children
  const items = React.Children.toArray(children).filter(
    child => React.isValidElement(child) && child.type === AccordionItem
  );
  
  // Handler untuk klik item
  const handleToggle = (itemId) => {
    if (alwaysOpen) {
      // Jika alwaysOpen, toggle item yang diklik
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId) 
          : [...prev, itemId]
      );
    } else {
      // Jika tidak alwaysOpen, hanya buka item yang diklik
      setOpenItems(prev => 
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };
  
  // Inisialisasi item yang terbuka secara default
  React.useEffect(() => {
    const defaultOpenItems = items
      .filter(item => item.props.defaultOpen)
      .map(item => item.props.id);
    
    if (defaultOpenItems.length > 0) {
      if (alwaysOpen) {
        setOpenItems(defaultOpenItems);
      } else {
        setOpenItems([defaultOpenItems[0]]);
      }
    }
  }, []);
  
  return (
    <div 
      className={`accordion ${flush ? 'accordion-flush' : ''} ${className}`} 
      id={id}
      style={style}
    >
      {items.map((item) => {
        const {
          id: itemId,
          title,
          icon,
          disabled,
          children: itemChildren
        } = item.props;
        
        const isOpen = openItems.includes(itemId);
        
        return (
          <div className="accordion-item" key={itemId}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
                type="button"
                onClick={() => !disabled && handleToggle(itemId)}
                aria-expanded={isOpen}
                aria-controls={`${itemId}-collapse`}
                disabled={disabled}
              >
                {icon && <i className={`bi ${icon} me-2`}></i>}
                {title}
              </button>
            </h2>
            <div
              id={`${itemId}-collapse`}
              className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
              aria-labelledby={`${itemId}-header`}
              data-bs-parent={alwaysOpen ? null : `#${id}`}
            >
              <div className="accordion-body">
                {itemChildren}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;