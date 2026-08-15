import { useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function MessageForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      setStatus('error')
      return
    }
    setStatus('saving')
    const { error } = await supabase.from('messages').insert({ name, email, message })
    if (error) {
      setStatus('error')
      return
    }
    setStatus('done')
    setName('')
    setEmail('')
    setMessage('')
  }

  if (status === 'done') {
    return (
      <p className="rounded border border-navy-light bg-navy p-4 text-sm text-white">
        Thanks — your message has been sent.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded border border-navy-light bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-crimson"
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-navy-light bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-crimson"
      />
      <textarea
        required
        placeholder="Your Message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded border border-navy-light bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-crimson"
      />
      <button
        type="submit"
        disabled={status === 'saving'}
        className="rounded-full bg-crimson px-6 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-crimson-dark disabled:opacity-60"
      >
        {status === 'saving' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-crimson">Something went wrong — please try again.</p>
      )}
    </form>
  )
}

function Contact() {
  return (
    <section className="bg-navy-deep">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">
          Get Involved
        </p>
        <h1 className="mt-2 max-w-xl text-[28px] font-medium text-white md:text-[32px]">
          Stand With Ojwang Mariam
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Contact
            </h3>
            <p className="mt-3 text-white">
              <a href="mailto:ojwangmariam@gmail.com" className="hover:text-crimson">
                ojwangmariam@gmail.com
              </a>
            </p>
            <p className="mt-1 text-white">
              <a href="tel:+254722731328" className="hover:text-crimson">
                +254 722 731 328
              </a>
            </p>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-white/60">
              Campaign & Book Financials
            </h3>
            <div className="mt-3 rounded border border-navy-light bg-navy p-4">
              <p className="text-sm text-white/70">
                M-Pesa Paybill: <span className="text-white">247247</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Number: <span className="text-white">731328</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                Account Name:{' '}
                <span className="text-white">Ojwang Mariam Solutions</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Send a Message
            </h3>
            <div className="mt-3">
              <MessageForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
