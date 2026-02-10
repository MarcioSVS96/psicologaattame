import Link from "next/link"

type Props = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  variant?: "default" | "soft"
}

export function TeaBannerSection({ title, subtitle, buttonText, buttonLink, variant = "default" }: Props) {
  const isInternal = buttonLink.startsWith("/")

  return (
    <section
      className="py-12 sm:py-14"
      style={{
        background:
          variant === "soft"
            ? "linear-gradient(135deg, rgba(79,70,229,0.10) 0%, rgba(245,158,11,0.08) 100%)"
            : "linear-gradient(135deg, rgba(79,70,229,0.14) 0%, rgba(29,78,216,0.10) 100%)",
        borderTop: "1px solid var(--tea-border)",
        borderBottom: "1px solid var(--tea-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "var(--tea-surface)",
            border: "1px solid var(--tea-border)",
          }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: "var(--tea-text)" }}>
                {title}
              </h2>
              <p className="text-base sm:text-lg" style={{ color: "var(--tea-muted)" }}>
                {subtitle}
              </p>
            </div>

            {isInternal ? (
              <Link
                href={buttonLink}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold"
                style={{ background: "var(--tea-primary)", color: "#fff" }}
              >
                {buttonText}
              </Link>
            ) : (
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold"
                style={{ background: "var(--tea-primary)", color: "#fff" }}
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
