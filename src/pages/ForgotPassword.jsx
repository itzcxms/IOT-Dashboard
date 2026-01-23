import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  };

  return (
    <main className="flex min-h-screen w-screen overflow-x-hidden bg-slate-900">
      <div className="relative flex-[7] h-screen overflow-hidden">
        <img
          src="/login/val-de-loir-bg.png"
          alt="img-bg"
          className="h-full w-full object-cover"
        />
        <img
          src="/login/logo.png"
          alt="Logo"
          className="absolute top-6 left-6 w-64"
        />
      </div>

      <div className="flex flex-[3] min-h-screen items-center justify-center bg-slate-900 px-6 sm:px-10">
        <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-50">
              Mot de passe oublié
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Indiquez votre adresse e-mail, nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 px-3 py-2">
                <p className="text-sm text-emerald-200">{success}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition-colors"
            >
              Envoyer le lien de réinitialisation
            </button>

            <div className="text-center text-xs text-slate-400">
              <a href="/connexion" className="underline hover:text-slate-200">
                Revenir à la page de connexion
              </a>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
