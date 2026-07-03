export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line/70 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg text-pine font-semibold">
            PawPal
          </p>
          <p className="text-sm text-ink/60 mt-1">
            Every pet on this page is waiting for a name on their kennel card
            to change to yours.
          </p>
        </div>
        <p className="font-stamp text-xs tracking-widest text-ink/40 uppercase">
          &copy; {new Date().getFullYear()} PawPal Shelter Network
        </p>
      </div>
    </footer>
  );
}
