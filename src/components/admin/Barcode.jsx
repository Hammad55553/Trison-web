import React, { useMemo } from 'react';
import { barcodeSVG } from '../../utils/barcode';

const Barcode = ({ value, moduleWidth = 2, height = 70, showText = true, className = '' }) => {
  const svg = useMemo(
    () => barcodeSVG(value, { moduleWidth, height, showText }),
    [value, moduleWidth, height, showText]
  );
  return (
    <div
      className={`barcode-svg-wrap ${className}`.trim()}
      // barcodeSVG returns trusted, self-generated markup (no user HTML)
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Barcode;
