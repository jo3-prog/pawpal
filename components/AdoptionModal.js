import { useState } from "react";
import { usePets } from "../context/PetContext";

export default function AdoptionModal({ pet, onClose }) {
  const { applyToAdopt } = usePets();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    applyToAdopt(pet.id, form);
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adoption-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="kennel-card w-full max-w-md p-6 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close adoption form"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ink/50 hover:text-ink hover:bg-paper"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3" aria-hidden="true">
              🐾
            </div>
            <h2
              id="adoption-modal-title"
              className="text-xl font-semibold"
            >
              Application sent!
            </h2>
            <p className="text-ink/70 mt-2">
              Thanks for applying to adopt {pet.name}. You can check the
              status any time on the My Applications page.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary mt-5"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2
              id="adoption-modal-title"
              className="text-xl font-semibold pr-8"
            >
              Apply to adopt {pet.name}
            </h2>
            <p className="text-sm text-ink/60 mt-1 mb-5">
              Tell the shelter a little about yourself and they&apos;ll follow up
              by email.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="applicant-name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="applicant-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="input-field"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-coral mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="applicant-email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="applicant-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="input-field"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-coral mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="applicant-message"
                  className="block text-sm font-medium mb-1.5"
                >
                  Why are you a good fit? (optional)
                </label>
                <textarea
                  id="applicant-message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange("message")}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Submit application
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
