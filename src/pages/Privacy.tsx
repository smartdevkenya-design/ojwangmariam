import { Link } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'

const UPDATED = '28 September 2026'

function Privacy() {
  const { settings } = useSiteData()
  const h2 = 'mt-10 text-xl font-semibold text-navy'
  const p = 'mt-3 text-base leading-relaxed text-muted'
  const li = 'mt-2 text-base leading-relaxed text-muted'

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-crimson">Legal</p>
        <h1 className="mt-2 text-[28px] font-medium text-navy md:text-[32px]">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted">Last updated: {UPDATED}</p>

        <p className={p}>
          This policy explains how the Ojwang Mariam campaign website (ojwangmariam.co.ke) collects, uses and protects
          your personal information, in line with the Kenya Data Protection Act, 2019.
        </p>

        <h2 className={h2}>1. Who we are</h2>
        <p className={p}>
          The site is run by the Ojwang Mariam campaign, {settings.address}. For any privacy question, contact us at{' '}
          <a href={`mailto:${settings.email}`} className="text-crimson hover:underline">
            {settings.email}
          </a>{' '}
          or {settings.phone}.
        </p>

        <h2 className={h2}>2. Information we collect</h2>
        <ul className="mt-3 list-disc pl-6">
          <li className={li}>
            <strong className="text-navy">Contact form:</strong> your name, email address, phone number (optional) and
            the message you send.
          </li>
          <li className={li}>
            <strong className="text-navy">“Join the campaign” bar and volunteer sign-ups:</strong> your name, email address and
            phone number (optional).
          </li>
          <li className={li}>
            <strong className="text-navy">Technical data:</strong> basic information your browser sends to our hosting
            and database providers, such as IP address, device and browser type, and pages requested.
          </li>
        </ul>
        <p className={p}>We do not ask for sensitive personal data through this site. Please do not include it in messages.</p>

        <h2 className={h2}>3. How we use it</h2>
        <ul className="mt-3 list-disc pl-6">
          <li className={li}>To reply to your messages and questions.</li>
          <li className={li}>To organise volunteers and keep supporters informed about campaign activities and events.</li>
          <li className={li}>To keep the website secure and working properly.</li>
        </ul>
        <p className={p}>
          We only send campaign updates to people who have asked to join or contacted us, and you can ask us to stop at
          any time.
        </p>

        <h2 className={h2}>4. Who we share it with</h2>
        <p className={p}>We do not sell your personal information. It is processed only by service providers that run the site for us:</p>
        <ul className="mt-3 list-disc pl-6">
          <li className={li}>Supabase, which stores form submissions and site content in its hosted database.</li>
          <li className={li}>GitHub Pages, which hosts the website files.</li>
          <li className={li}>YouTube (Google), when a video is embedded on the Media page. YouTube may set its own cookies once you play or load a video, under its own privacy policy.</li>
        </ul>
        <p className={p}>We may disclose information if required by law or a court order.</p>

        <h2 className={h2}>5. Cookies</h2>
        <p className={p}>
          This site does not use advertising or tracking cookies. The only third-party cookies come from embedded YouTube
          videos, as described above.
        </p>

        <h2 className={h2}>6. How long we keep it</h2>
        <p className={p}>
          We keep messages and sign-up details for as long as needed to respond and to run the campaign, and delete them
          when they are no longer needed or when you ask us to.
        </p>

        <h2 className={h2}>7. Your rights</h2>
        <p className={p}>Under the Data Protection Act you have the right to:</p>
        <ul className="mt-3 list-disc pl-6">
          <li className={li}>be told how your data is used and ask for a copy of it;</li>
          <li className={li}>ask us to correct or delete your data;</li>
          <li className={li}>object to, or ask us to restrict, the use of your data, including for campaign messages.</li>
        </ul>
        <p className={p}>
          To use any of these rights, email{' '}
          <a href={`mailto:${settings.email}`} className="text-crimson hover:underline">
            {settings.email}
          </a>
          . If you are unhappy with our response, you may complain to the Office of the Data Protection Commissioner of
          Kenya (odpc.go.ke).
        </p>

        <h2 className={h2}>8. Security</h2>
        <p className={p}>
          Data is sent over an encrypted (HTTPS) connection and stored with access restricted to authorised campaign
          administrators. No system is completely secure, so we cannot guarantee absolute security.
        </p>

        <h2 className={h2}>9. Children</h2>
        <p className={p}>This site is not directed at children under 18, and we do not knowingly collect their information.</p>

        <h2 className={h2}>10. Changes to this policy</h2>
        <p className={p}>We may update this policy from time to time. The date at the top shows when it was last changed.</p>

        <Link to="/" className="mt-10 inline-block text-sm font-medium uppercase tracking-wide text-crimson hover:text-crimson-dark">
          ← Back to Home
        </Link>
      </div>
    </section>
  )
}

export default Privacy
