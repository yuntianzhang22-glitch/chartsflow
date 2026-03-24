import { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import './ColorPicker.css';

extend([mixPlugin]);

function ColorPicker({ color, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [isGradient, setIsGradient] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#3B82F6');
  const [gradientAngle, setGradientAngle] = useState(135);

  const handleColorChange = (newColor) => {
    if (isGradient) {
      const gradient = `linear-gradient(${gradientAngle}deg, ${newColor}, ${gradientColor2})`;
      onChange(gradient);
    } else {
      const withOpacity = colord(newColor).alpha(opacity / 100).toHex();
      onChange(withOpacity);
    }
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    const currentColor = color?.includes('gradient') ? '#000000' : color;
    if (currentColor) {
      const withOpacity = colord(currentColor).alpha(newOpacity / 100).toHex();
      onChange(withOpacity);
    }
  };

  const handleGradientToggle = () => {
    setIsGradient(!isGradient);
    if (!isGradient) {
      onChange(`linear-gradient(135deg, ${color || '#2563EB'}, ${gradientColor2})`);
    } else {
      onChange(color || '#2563EB');
    }
  };

  const getPreviewStyle = () => {
    if (isGradient || (color && color.includes('gradient'))) {
      return { background: color || 'linear-gradient(135deg, #2563EB, #3B82F6)' };
    }
    return { backgroundColor: color || '#2563EB' };
  };

  return (
    <div className="color-picker-wrapper">
      {label && <label className="config-label">{label}</label>}
      <div className="color-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="color-preview" style={getPreviewStyle()}></div>
        <span className="color-value">{color || '#2563EB'}</span>
        <svg className="color-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="color-picker-dropdown">
          <HexColorPicker color={color?.includes('gradient') ? '#2563EB' : color} onChange={handleColorChange} />
          
          <div className="color-picker-section">
            <div className="color-picker-row">
              <span className="color-picker-label">HEX</span>
              <HexColorInput color={color?.includes('gradient') ? '#2563EB' : color} onChange={handleColorChange} prefixed={false} className="color-input" />
            </div>
            
            <div className="color-picker-row">
              <span className="color-picker-label">不透明度</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={opacity} 
                onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                className="opacity-slider" 
              />
              <span className="opacity-value">{opacity}%</span>
            </div>
            
            <div className="color-picker-row">
              <label className="gradient-toggle">
                <input 
                  type="checkbox" 
                  checked={isGradient} 
                  onChange={handleGradientToggle} 
                />
                <span>渐变</span>
              </label>
            </div>
            
            {isGradient && (
              <>
                <div className="color-picker-row">
                  <span className="color-picker-label">渐变色</span>
                  <input 
                    type="color" 
                    value={gradientColor2}
                    onChange={(e) => {
                      setGradientColor2(e.target.value);
                      onChange(`linear-gradient(${gradientAngle}deg, ${color || '#2563EB'}, ${e.target.value})`);
                    }}
                    className="color-input color-input-color"
                  />
                </div>
                <div className="color-picker-row">
                  <span className="color-picker-label">角度</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={gradientAngle} 
                    onChange={(e) => {
                      setGradientAngle(parseInt(e.target.value));
                      onChange(`linear-gradient(${e.target.value}deg, ${color || '#2563EB'}, ${gradientColor2})`);
                    }}
                    className="opacity-slider" 
                  />
                  <span className="opacity-value">{gradientAngle}°</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;