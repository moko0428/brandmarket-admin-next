export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-screen-md mx-auto h-screen bg-white">
      {children}
    </div>
  );
}
