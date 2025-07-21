export default function ManageSectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-30 items-center justify-center rounded-2xl border-2 border-border">
      {children}
    </div>
  );
}
