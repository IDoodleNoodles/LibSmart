import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/')[1] || 'Page';
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-black">
        {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
      </h1>
      <p className="text-libsmart-slate max-w-2xl">
        This page is coming soon. Continue prompting to fill in the content for this section.
      </p>
      <div className="bg-white border border-libsmart-slate/20 rounded-lg p-8 text-center">
        <p className="text-libsmart-slate">Placeholder content</p>
      </div>
    </div>
  );
}
