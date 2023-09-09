interface LayoutProps {
  children: React.ReactNode;
  heading: string;
  slot?: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children, heading, slot } = props;

  return (
    <>
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {heading}
              </h1>
              {slot && slot}
            </div>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
