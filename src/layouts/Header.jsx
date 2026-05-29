function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-150 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none tracking-tight">
              Pushkaralu 2027
            </h1>
            <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest leading-none">
              Govt. Administration
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold text-gray-900 border-b-2 border-brand-600 pb-1">
            Dashboard
          </a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Ghat Finder
          </a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Safety Measures
          </a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Helpline
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Emergency Alerts
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
