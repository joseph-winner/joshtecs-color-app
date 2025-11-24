"use client";
import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to your newsletter endpoint / API
  }

  return (
    <footer className="bg-[#0E1217] text-slate-100">
      {/* Top */}
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Logo + blurb */}
          <div className="space-y-6">
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              We craft modern brands, websites, and digital products for
              ambitious teams across Africa helping you launch faster and grow
              smarter.
            </p>
          </div>

          {/* Middle: Newsletter */}
          <div className="lg:mx-8">
            <h3 className="text-base font-semibold tracking-wider text-slate-200">
              SUBSCRIBE TO NEWSLETTER
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="sr-only">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full rounded-xl bg-slate-700/60 px-4 py-3.5 text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-slate-500"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full rounded-xl bg-slate-700/60 px-4 py-3.5 text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-slate-500"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full rounded-xl bg-slate-700/60 px-4 py-3.5 text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-slate-500"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-[hsl(47,100%,70%)] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#ffd230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:ring-offset-[#0E1217]"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Right: Contact + Social */}
          <div className="lg:justify-self-end">
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold tracking-wider text-slate-200">
                  CONTACT US
                </h3>
                <p className="mt-3 text-slate-300">
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:hello@joshtecs.com"
                    className="underline decoration-slate-500 underline-offset-4 hover:text-white"
                  >
                    info@joshtecs.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-wider text-slate-200">
                  FOLLOW US
                </h3>

                <div className="mt-3 flex items-center gap-3">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/joshtecs-software-solutions"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 bg-slate-800/50 text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                  >
                    <span className="font-semibold text-lg leading-none">
                      in
                    </span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href="https://x.com/joshtecs_"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X (Twitter)"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 bg-slate-800/50 text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                  >
                    <span className="font-semibold text-lg leading-none">
                      X
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Bottom row */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            © {year} Joshtecs Solutions. All rights reserved.
          </p>

          <a
            href="/privacy"
            className="text-sm text-slate-300 underline decoration-slate-500 underline-offset-4 hover:text-white"
          >
            Read our privacy policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
