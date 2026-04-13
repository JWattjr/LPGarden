interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main className={`mx-auto w-full max-w-6xl flex-1 px-6 py-8 ${className}`}>
      {children}
    </main>
  );
}
