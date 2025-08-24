import { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }

    // Calculate password strength
    let calculatedStrength = 0;

    // Length check
    if (password.length >= 6) calculatedStrength += 1;
    if (password.length >= 8) calculatedStrength += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) calculatedStrength += 1; // Has uppercase
    if (/[a-z]/.test(password)) calculatedStrength += 1; // Has lowercase
    if (/[0-9]/.test(password)) calculatedStrength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) calculatedStrength += 1; // Has special char

    // Normalize to 0-4 scale
    const normalizedStrength = Math.min(4, Math.floor(calculatedStrength / 1.5));
    setStrength(normalizedStrength);

    // Set label based on strength
    const labels = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    setLabel(labels[normalizedStrength]);
  }, [password]);

  // Don't render anything if password is empty
  if (!password) return null;

  // Determine color classes based on strength
  const getColorClasses = () => {
    const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    const textColors = ['', 'text-red-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];
    return { bg: colors[strength], text: textColors[strength] };
  };

  const colors = getColorClasses();

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="flex-1 flex space-x-1 h-1.5">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`flex-1 rounded-full transition-colors duration-300 ${
                index < strength ? colors.bg : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        {label && (
          <span className={`ml-2 text-sm font-medium ${colors.text}`}>
            {label}
          </span>
        )}
      </div>

      {/* Password requirements */}
      <div className="mt-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            {password.length >= 6 ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <Circle className="w-3 h-3 text-gray-400 mr-1" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Min. 6 karakter</span>
          </div>
          <div className="flex items-center">
            {/[A-Z]/.test(password) ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <Circle className="w-3 h-3 text-gray-400 mr-1" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Huruf besar</span>
          </div>
          <div className="flex items-center">
            {/[0-9]/.test(password) ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <Circle className="w-3 h-3 text-gray-400 mr-1" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Angka</span>
          </div>
          <div className="flex items-center">
            {/[^A-Za-z0-9]/.test(password) ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <Circle className="w-3 h-3 text-gray-400 mr-1" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Karakter khusus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
