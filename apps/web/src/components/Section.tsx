interface SectionProps {
  children: React.ReactNode;
  slot?: React.ReactNode;
  heading: string;
}

export default function Section(props: SectionProps) {
  const { children, heading, slot } = props;

  return (
    <section>
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold leading-6 text-body">
            {heading}
          </h2>
          {slot && slot}
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </section>
  );
}
