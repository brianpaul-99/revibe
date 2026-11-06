import type { CSSProperties } from 'react';
import Image from 'next/image';
import SiteMotion from '@/components/SiteMotion';

// Custom properties (--i, --n) drive stagger and sticky offsets in globals.css
const cssVars = (v: Record<string, number>) => v as CSSProperties;

export default function Home() {
  return (
    <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="progress" aria-hidden="true"><span></span></div>
    <div className="grain" aria-hidden="true"></div>

    {/* ============ NAV ============ */}
    <header className="nav" id="nav">
      <div className="nav-in wrap">
        <a className="nav-logo" href="#top" aria-label="Revibe, back to top">
          <img src="/assets/skull.svg" alt="" width="38" height="30" className="nav-skull" />
          <img src="/assets/wordmark.svg" alt="Revibe" width="104" height="35" className="nav-word" />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#process">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn btn-y nav-cta" href="#contact">Book a call</a>
        <button className="nav-burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
          <span></span><span></span>
        </button>
      </div>
    </header>

    <div className="menu" id="menu" hidden>
      <svg className="burst menu-burst" data-spikes="18" data-inner=".7" viewBox="-100 -100 200 200" aria-hidden="true"><path/></svg>
      <nav aria-label="Mobile">
        <a href="#services"><span>Services</span></a>
        <a href="#process"><span>How it works</span></a>
        <a href="#pricing"><span>Pricing</span></a>
        <a href="#faq"><span>FAQ</span></a>
        <a href="#contact"><span>Book a call</span></a>
      </nav>
      <p className="menu-foot">Revibe Labs · Toronto, ON</p>
    </div>

    <main id="main">

    {/* ============ HERO ============ */}
    <section className="hero" id="top" aria-labelledby="heroTitle">
      <canvas className="hero-ink" aria-hidden="true"></canvas>
      <img className="hero-fallback" src="/assets/skull.svg" alt="" aria-hidden="true" />

      <div className="hud" aria-hidden="true">
        <span className="hud-tl" data-type="">Revibe Labs ✹ Toronto, ON</span>
        <span className="hud-tr" data-type="">SEO / Web / Outbound</span>
        <span className="hud-bl" data-type="">43.65° N, 79.38° W</span>
        <span className="hud-br"><span className="hud-hint">Move to stir the ink</span> <span className="hud-f">F 0000</span></span>
      </div>

      <div className="hero-in wrap">
        <p className="eyebrow hero-eyebrow"><span className="sq"></span>SEO, websites and outbound for service businesses</p>
        <h1 className="hero-title" id="heroTitle">
          <span className="hl">Make the</span>{' '}
          <span className="hl">phone</span>{' '}
          <span className="hl">ring.</span>
        </h1>
        <div className="hero-card">
          <p>We get you found on Google, build the site that turns visits into calls, then go out and book meetings with buyers who haven't found you yet.</p>
          <p className="hero-card-sub">Two people. One pipeline. No account managers.</p>
          <div className="btns">
            <a className="btn btn-y" href="#contact">Book a call <span aria-hidden="true">→</span></a>
            <a className="btn btn-o" href="#services">See what we run</a>
          </div>
        </div>
      </div>
    </section>

    {/* ============ TICKER ============ */}
    <div className="ticker" aria-hidden="true">
      <div className="band band-back"><div className="band-track" data-band="">
        <span>Get found</span><i>✹</i><span>Get chosen</span><i>✹</i><span>Get booked</span><i>✹</i>
      </div></div>
      <div className="band band-front"><div className="band-track" data-band="">
        <span>SEO</span><i>✹</i><span>Web builds</span><i>✹</i><span>Site management</span><i>✹</i><span>Lead gen</span><i>✹</i><span>Cold outreach</span><i>✹</i><span>Brand momentum for search</span><i>✹</i>
      </div></div>
    </div>

    {/* ============ PROBLEM ============ */}
    <section className="problem" id="problem" aria-labelledby="problemTitle">
      <div className="wrap">
        <p className="label" data-reveal="wipe"><span>[ The problem ]</span></p>
        <h2 className="sr" id="problemTitle">Why one channel isn't enough</h2>
        <p className="manifesto" data-manifesto="">
          Most agencies sell you one piece and call it growth. Rankings that send people to a site nobody trusts. A <em>pretty site nobody visits.</em> And while you wait for inbound, your competitor is already in your best client's inbox.
        </p>
        <p className="manifesto-hit" data-reveal="">
          <span className="ln"><span>So we run</span></span>{' '}
          <span className="ln"><span><mark>the whole pipe.</mark></span></span>
        </p>

        <ul className="facts" role="list">
          <li data-reveal="pop" style={cssVars({ '--i': 0 })}><b data-count="2">2</b><span>People doing the work. Both on your first call.</span></li>
          <li data-reveal="pop" style={cssVars({ '--i': 1 })}><b data-count="0">0</b><span>Account managers between you and the work.</span></li>
          <li data-reveal="pop" style={cssVars({ '--i': 2 })}><b data-count="3">3</b><span>Channels, one team, one monthly report.</span></li>
          <li data-reveal="pop" style={cssVars({ '--i': 3 })}><b data-count="30">30</b><span>Days from kickoff to the first launch.</span></li>
        </ul>
      </div>
    </section>

    <div className="tear" data-from="studio" data-to="void" aria-hidden="true"></div>

    {/* ============ SERVICES ============ */}
    <section className="services" id="services" aria-labelledby="servicesTitle">
      <div className="wrap">
        <div className="sec-head">
          <p className="label" data-reveal="wipe"><span>[ What we do ]</span></p>
          <h2 className="h2" id="servicesTitle" data-reveal="">
            <span className="ln"><span>Three channels.</span></span>{' '}
            <span className="ln"><span>One team <em>running all of them.</em></span></span>
          </h2>
        </div>

        <div className="stack">
          {/* 01 SEO */}
          <article className="svc" id="seo" style={cssVars({ '--n': 0 })}>
            <div className="svc-copy">
              <div className="svc-top"><span className="svc-num">01</span><span className="svc-tag">SEO</span></div>
              <h3 className="svc-title">Get found.</h3>
              <p className="svc-lead">Your buyers are already searching. We make sure it's your name they click.</p>
              <p>We audit your search footprint, fix the technical problems holding you back, then build the pages and local presence that rank for the searches your buyers actually run.</p>
              <ul className="ticks" role="list">
                <li>Technical SEO audit and fixes</li>
                <li>Local SEO and Google Business Profile</li>
                <li>Service and location pages built to rank</li>
                <li>Content planned from real search demand</li>
                <li>Monthly rankings, calls and leads report</li>
              </ul>
            </div>
            <div className="svc-viz"><canvas data-viz="seo" aria-label="Animation: a search result climbing from ninth to first place" role="img"></canvas><span className="viz-cap">Fig. 02 · Rank climb</span></div>
          </article>

          {/* 02 WEB */}
          <article className="svc" id="web" style={cssVars({ '--n': 1 })}>
            <div className="svc-copy">
              <div className="svc-top"><span className="svc-num">02</span><span className="svc-tag">Web dev + management</span></div>
              <h3 className="svc-title">Get chosen.</h3>
              <p className="svc-lead">Traffic to a slow, confusing site is a leak. We build sites that load fast and make calling you the obvious next move.</p>
              <p>We design and build it, then we keep running it. Hosting, updates, edits, speed and conversion fixes, all handled by the people who built it. You never file a ticket with a stranger.</p>
              <ul className="ticks" role="list">
                <li>Custom design and build</li>
                <li>Pages structured to turn visits into calls</li>
                <li>Hosting, security and updates</li>
                <li>Content edits when you need them</li>
                <li>Speed and Core Web Vitals tuning</li>
              </ul>
            </div>
            <div className="svc-viz"><canvas data-viz="web" aria-label="Animation: a website assembling block by block, then a visitor clicks the call button and a new lead arrives" role="img"></canvas><span className="viz-cap">Fig. 03 · Build, then convert</span></div>
          </article>

          {/* 03 OUTBOUND */}
          <article className="svc" id="outbound" style={cssVars({ '--n': 2 })}>
            <div className="svc-copy">
              <div className="svc-top"><span className="svc-num">03</span><span className="svc-tag">Lead gen + outreach</span></div>
              <h3 className="svc-title">Go get them.</h3>
              <p className="svc-lead">Inbound takes time. Outbound starts this month.</p>
              <p>We build targeted lead lists, write short emails that say one true thing about each business, and run the sending, follow-ups and replies. Qualified conversations land on your calendar.</p>
              <ul className="ticks" role="list">
                <li>Ideal client profile and target lists</li>
                <li>Verified contact data</li>
                <li>Sending domains set up and warmed</li>
                <li>Personal sequences and follow-ups</li>
                <li>Reply handling and meeting booking</li>
              </ul>
            </div>
            <div className="svc-viz"><canvas data-viz="out" aria-label="Animation: a grid of prospects being contacted, some replying, a few booking meetings" role="img"></canvas><span className="viz-cap">Fig. 04 · Sent, replied, booked</span></div>
          </article>
        </div>
      </div>
    </section>

    {/* ============ PIPELINE ============ */}
    <section className="pipe" id="pipeline" aria-labelledby="pipeTitle">
      <canvas className="truchet" aria-hidden="true"></canvas>
      <div className="pipe-in wrap">
        <div className="banner" data-reveal="banner">
          <h2 id="pipeTitle"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></h2>
        </div>
        <div className="pipe-card" data-reveal="pop">
          <p>Each channel feeds the next. Outbound prospects Google you before they reply, so your rankings and your site do the convincing. Search data tells outbound who to go after. One team sees all of it, so nothing falls between two vendors.</p>
        </div>
      </div>
    </section>

    <div className="tear" data-from="void" data-to="studio" aria-hidden="true"></div>

    {/* ============ PROCESS ============ */}
    <section className="process" id="process" aria-labelledby="processTitle">
      <div className="wrap process-grid">
        <div className="process-side">
          <p className="label" data-reveal="wipe"><span>[ How it works ]</span></p>
          <h2 className="h2" id="processTitle" data-reveal="">
            <span className="ln"><span>From audit</span></span>{' '}
            <span className="ln"><span>to <em>booked calls.</em></span></span>
          </h2>
          <p className="process-note">No 60-page strategy PDF. You know what we're doing, why, and what it's moving.</p>
          <a className="btn btn-y" href="#contact">Start with an audit <span aria-hidden="true">→</span></a>
        </div>
        <ol className="steps" role="list">
          <li className="step"><span className="step-n">01</span><div><h3>Audit <small>Week 1</small></h3><p>Where you show up in search, where you don't, what your site does with visitors and who you should be selling to. You get a plain-English plan with priorities.</p></div></li>
          <li className="step"><span className="step-n">02</span><div><h3>Build <small>Weeks 2 to 4</small></h3><p>Technical fixes, page rebuilds, tracking, sending domains and lead lists. The infrastructure goes in before anything goes out.</p></div></li>
          <li className="step"><span className="step-n">03</span><div><h3>Launch <small>Week 4 on</small></h3><p>Pages go live, content starts publishing and the first outbound campaign starts sending. You see every email before it goes.</p></div></li>
          <li className="step"><span className="step-n">04</span><div><h3>Run <small>Every month</small></h3><p>We push what's working and cut what isn't. One report with the numbers that matter: calls, booked meetings, rankings, and what we're doing next.</p></div></li>
        </ol>
      </div>
    </section>

    {/* ============ PRICING ============ */}
    <section className="pricing" id="pricing" aria-labelledby="pricingTitle">
      <div className="wrap">
        <div className="sec-head sec-head-row">
          <div>
            <p className="label" data-reveal="wipe"><span>[ Pricing ]</span></p>
            <h2 className="h2" id="pricingTitle" data-reveal=""><span className="ln"><span>Pick a starting point.</span></span></h2>
          </div>
          <p className="sec-sub">Monthly retainers. Website builds are quoted per project, and we'll tell you if a smaller plan does the job.</p>
        </div>

        <div className="plans">
          <article className="plan" data-reveal="pop" style={cssVars({ '--i': 0 })}>
            <p className="plan-name">Starter</p>
            <p className="plan-price"><b>$2,000</b><span>/mo</span></p>
            <p className="plan-for">Get found. For local businesses that need a search foundation and a site someone actually looks after.</p>
            <ul className="ticks" role="list">
              <li>Technical SEO cleanup</li>
              <li>Google Business Profile management</li>
              <li>Hosting, updates and site edits</li>
              <li>Monthly report</li>
            </ul>
            <a className="btn btn-o" href="#contact" data-plan="Starter">Get started</a>
          </article>

          <article className="plan" data-reveal="pop" style={cssVars({ '--i': 1 })}>
            <p className="plan-name">Growth</p>
            <p className="plan-price"><b>$4,000</b><span>/mo</span></p>
            <p className="plan-for">Get found and get chosen. For businesses ready to grow search traffic and turn more of it into leads.</p>
            <ul className="ticks" role="list">
              <li>Everything in Starter</li>
              <li>SEO content plan and new pages monthly</li>
              <li>Local landing pages</li>
              <li>Conversion fixes on key pages</li>
            </ul>
            <a className="btn btn-o" href="#contact" data-plan="Growth">Get started</a>
          </article>

          <article className="plan plan-hot" data-reveal="pop" style={cssVars({ '--i': 2 })}>
            <div className="sticker" aria-hidden="true">
              <svg className="burst" data-spikes="14" data-inner=".66" viewBox="-100 -100 200 200"><path/></svg>
              <span>Full<br />pipe</span>
            </div>
            <p className="plan-name">Authority</p>
            <p className="plan-price"><b>$6,000</b><span>/mo</span></p>
            <p className="plan-for">The whole pipeline. Search, site and outbound run by one team, reported in one place.</p>
            <ul className="ticks" role="list">
              <li>Everything in Growth</li>
              <li>Outbound lead generation</li>
              <li>List building and sending setup</li>
              <li>Reply handling and meeting booking</li>
            </ul>
            <a className="btn btn-y" href="#contact" data-plan="Authority">Get started <span aria-hidden="true">→</span></a>
          </article>

          <article className="plan plan-custom" data-reveal="pop" style={cssVars({ '--i': 3 })}>
            <p className="plan-name">Custom</p>
            <p className="plan-price"><b>Let's talk</b></p>
            <p className="plan-for">A site build, an outbound-only campaign, or something in between. Tell us what you need and we'll scope it.</p>
            <ul className="ticks" role="list">
              <li>Website builds, quoted per project</li>
              <li>Outbound-only campaigns</li>
              <li>One-off or ongoing</li>
            </ul>
            <a className="btn btn-o" href="#contact" data-plan="Custom">Get in touch</a>
          </article>
        </div>
      </div>
    </section>

    {/* ============ FOUNDERS ============ */}
    <section className="founders" id="studio" aria-labelledby="foundersTitle">
      <div className="wrap">
        <p className="label" data-reveal="wipe"><span>[ Who you work with ]</span></p>
        <h2 className="sr" id="foundersTitle">The founders</h2>
        <blockquote className="quote" data-reveal="">
          <span className="ln"><span>The work either</span></span>{' '}
          <span className="ln"><span>moves the needle</span></span>{' '}
          <span className="ln"><span>or it doesn't.</span></span>{' '}
          <span className="ln"><span><mark>Everything else</mark></span></span>{' '}
          <span className="ln"><span><mark>is a report.</mark></span></span>
        </blockquote>
        <div className="founders-row">
          <p className="founders-copy">Revibe is a two-person studio in Toronto. The people on your first call are the people doing the work. No handoffs to a junior team, no account manager translating between you and the build.</p>
          <ul className="people" role="list">
            <li className="person" data-reveal="pop" style={cssVars({ '--i': 0 })}>
              <span className="person-photo"><Image src="/timothy-cartoon.png" alt="Timothy Limpin" width={72} height={72} sizes="72px" /></span>
              <div><b>Timothy Limpin</b><span>Co-founder &amp; CEO</span></div>
            </li>
            <li className="person" data-reveal="pop" style={cssVars({ '--i': 1 })}>
              <span className="person-photo"><Image src="/brian-cartoon.png" alt="Brian Paul" width={72} height={72} sizes="72px" /></span>
              <div><b>Brian Paul</b><span>Co-founder &amp; CTO</span></div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    {/* ============ FAQ ============ */}
    <section className="faq" id="faq" aria-labelledby="faqTitle">
      <div className="wrap faq-grid">
        <div>
          <p className="label" data-reveal="wipe"><span>[ FAQ ]</span></p>
          <h2 className="h2" id="faqTitle" data-reveal=""><span className="ln"><span>Straight</span></span><span className="ln"><span>answers.</span></span></h2>
        </div>
        <div className="qa" data-faq="">
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">Do I need all three services?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>No. Plenty of clients start with SEO or a site and add outbound later. On the first call we'll tell you which channel moves your numbers fastest, even if it's the cheaper one.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">Will cold email hurt my domain?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>We send outbound from separate domains that are set up and warmed for sending, so your main domain and inbox stay clean. Volumes stay low and targeted. Spraying thousands of emails is how domains get burned.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">Is cold outreach allowed in Canada?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>We build every campaign to follow CASL and CAN-SPAM: messages relevant to the person's role, a clearly identified sender and a working unsubscribe on every email. If a market or list doesn't fit those rules, we don't send to it.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">How long until I see results?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>Outbound is the fast lane. Campaigns go out in the first month, so conversations can start right away. SEO compounds slower: expect real movement over three to six months, and momentum after that. That's exactly why we run both.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">Can you work with my existing website?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>Yes. If it's fixable, we fix it and take over management. If it's costing you leads, we'll show you why and quote a rebuild. We won't push a rebuild you don't need.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">What do the monthly reports look like?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>One page. Calls, form fills, booked meetings, rankings for the searches that matter, and what we're doing next month. No 40-slide deck.</p></div></div>
          </div>
          <div className="qa-item">
            <h3><button type="button" aria-expanded="false">What's the minimum budget?<i aria-hidden="true"></i></button></h3>
            <div className="qa-a"><div><p>Retainers start at $2,000 a month and website builds are quoted per project. If you're below that, we'll say so and point you somewhere useful. Better than wasting both our time.</p></div></div>
          </div>
        </div>
      </div>
    </section>

    {/* ============ CONTACT ============ */}
    <section className="contact" id="contact" aria-labelledby="contactTitle">
      <div className="wrap contact-grid">
        <div className="contact-side">
          <p className="label" data-reveal="wipe"><span>[ Book a call ]</span></p>
          <h2 className="h2 contact-title" id="contactTitle" data-reveal="">
            <span className="ln"><span>Let's make</span></span>{' '}
            <span className="ln"><span>the phone</span></span>{' '}
            <span className="ln"><span><mark>ring.</mark></span></span>
          </h2>
          <div className="mark-stage" aria-hidden="true">
            <svg className="burst mark-burst" data-spikes="16" data-inner=".64" viewBox="-100 -100 200 200"><path/></svg>
            <canvas className="mark-skull"></canvas>
            <img className="mark-fallback" src="/assets/skull.svg" alt="" />
          </div>
        </div>

        <form className="form" id="contactForm" action="/api/contact" method="post" noValidate>
          {/* spam trap: people never see or fill this */}
          <label className="hp" aria-hidden="true">Leave this empty<input type="text" name="company_url" tabIndex={-1} autoComplete="off" /></label>
          <p className="form-lede">Tell us about the business. One of us replies within 24 hours. Not an account manager. One of the two people who'd do the work.</p>
          <div className="field-row">
            <label className="field"><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          </div>
          <label className="field"><span>Website <small>(if you have one)</small></span><input name="website" type="url" inputMode="url" placeholder="https://" /></label>

          <fieldset className="chips">
            <legend>What do you need?</legend>
            <label><input type="checkbox" name="need" value="SEO" /><span>SEO</span></label>
            <label><input type="checkbox" name="need" value="Website build" /><span>Website build</span></label>
            <label><input type="checkbox" name="need" value="Site management" /><span>Site management</span></label>
            <label><input type="checkbox" name="need" value="Outbound leads" /><span>Outbound leads</span></label>
            <label><input type="checkbox" name="need" value="Not sure yet" /><span>Not sure yet</span></label>
          </fieldset>

          <fieldset className="chips">
            <legend>Monthly budget</legend>
            <label><input type="radio" name="budget" value="Under $2k" /><span>Under $2k</span></label>
            <label><input type="radio" name="budget" value="$2k to $4k" /><span>$2k to $4k</span></label>
            <label><input type="radio" name="budget" value="$4k to $6k" /><span>$4k to $6k</span></label>
            <label><input type="radio" name="budget" value="$6k+" /><span>$6k+</span></label>
          </fieldset>

          <label className="field"><span>What's going on?</span><textarea name="message" rows={4} placeholder="What you sell, who you sell to, and what's not working."></textarea></label>
          <div className="form-foot">
            <button className="btn btn-y btn-big" type="submit">Send it <span aria-hidden="true">→</span></button>
            <p className="form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </section>

    </main>

    {/* ============ FOOTER ============ */}
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <p className="foot-tag">Brand momentum<br />for search.</p>
          <nav className="foot-cols" aria-label="Footer">
            <div><p>Services</p><a href="#seo">SEO</a><a href="#web">Web dev + management</a><a href="#outbound">Lead gen + outreach</a></div>
            <div><p>Studio</p><a href="#process">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></div>
            <div><p>Elsewhere</p><a href="#" data-todo="instagram">Instagram</a><a href="#" data-todo="linkedin">LinkedIn</a></div>
          </nav>
        </div>
        <div className="foot-word" data-reveal="rise"><img src="/assets/wordmark.svg" alt="Revibe" width="1400" height="470" /></div>
        <div className="foot-base"><span>© 2026 Revibe Labs</span><span>Toronto, ON</span><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
      <SiteMotion />
    </>
  );
}
