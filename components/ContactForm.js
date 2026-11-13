'use client';
import { useState } from 'react';

const PROJECT_TYPES = [
  'Social Media Management',
  'Meta & Google Ads',
  'Graphic Design',
  'Motion Graphics',
  'Brand Identity',
  'Website Development',
  'Other',
];

const COUNTRIES = [
  { name: 'Egypt', code: '+20' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'UAE', code: '+971' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Qatar', code: '+974' },
];

const input =
  'w-full rounded-full bg-[#a8a8a3] px-5 py-3 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#D4AF37]';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.target;
    const data = new FormData(form);
    data.set('countryCode', country.code);
    data.set('country', country.name);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus('done');
      form.reset();
      setFileName('');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <section dir="ltr" className="bg-black text-white px-6 py-20 md:px-16 border-b-4 border-[#D4AF37]">
        <h2 className="text-4xl md:text-6xl font-light text-[#D4AF37]">Thank you!</h2>
        <p className="mt-6 text-lg text-gray-300 max-w-xl">
          We received your request and we will contact you soon.
        </p>
      </section>
    );
  }

  return (
    <section dir="ltr" className="bg-black text-white px-6 py-16 md:px-16 border-b-4 border-[#D4AF37]">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight">
            CONTACT <span className="text-[#D4AF37]">US</span>
          </h2>
          <p className="mt-10 max-w-md text-gray-200">
            Planning a campaign, a new brand, or a website? Tell us about your
            project and we&rsquo;ll get back to you with the right solution.
          </p>
          <p className="mt-4 max-w-md text-gray-200">
            Leave your details and we&rsquo;ll call you soon.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2">Name</label>
            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" required placeholder="First name" className={input} />
              <input name="lastName" required placeholder="Last name" className={input} />
            </div>
          </div>

          <div>
            <label className="block mb-2">Phone</label>
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <select
                value={country.name}
                onChange={(e) =>
                  setCountry(COUNTRIES.find((c) => c.name === e.target.value))
                }
                className={input}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                name="phone"
                required
                type="tel"
                placeholder={country.code}
                className={input}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input name="email" type="email" placeholder="Add your email address" className={input} />
          </div>

          <div>
            <label className="block mb-2">Service needed</label>
            <select name="projectType" required defaultValue="" className={input}>
              <option value="" disabled>Select a service</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Message</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us about your business and what you need"
              className="w-full rounded-3xl bg-[#a8a8a3] px-5 py-3 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block mb-1">File Upload (optional)</label>
            <p className="mb-2 text-sm text-gray-400">
              Upload a brief, logo or reference files (max 4 MB).
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#D4AF37] py-8 text-center">
              <span className="text-2xl text-[#D4AF37]">+</span>
              <span>{fileName || 'Add a File'}</span>
              <input
                name="file"
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files[0]?.name || '')}
              />
            </label>
          </div>

          {status === 'error' && <p className="text-red-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full bg-[#D4AF37] px-8 py-3 font-semibold text-black hover:bg-[#e6c24a] disabled:opacity-50"
          >
            {status === 'sending' ? 'SENDING...' : 'SUBMIT'}
          </button>
        </form>
      </div>
    </section>
  );
}