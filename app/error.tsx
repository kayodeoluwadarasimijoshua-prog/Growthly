"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container">
        <h1>This page is temporarily unavailable.</h1>
        <p>
          We could not load the current website information. Please try again.
          No enquiry has been sent.
        </p>
        <button
          className="button button--primary mt-24"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </section>
  );
}
