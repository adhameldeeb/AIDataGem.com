
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface SystemDiagramProps {
  chart: string;
  className?: string;
}

const SystemDiagram: React.FC<SystemDiagramProps> = ({ chart, className = '' }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });
    
    if (mermaidRef.current) {
      mermaid.render('mermaid-svg', chart).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);
  
  return (
    <div className={`mermaid-wrapper overflow-auto bg-white p-4 rounded-lg border ${className}`}>
      <div ref={mermaidRef} className="mermaid"></div>
    </div>
  );
};

export default SystemDiagram;
