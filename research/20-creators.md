# Phase 1 Research — 20 Creators for Dee's Growth Dashboard

Source data: [`data/seed-creators.json`](../data/seed-creators.json). Pulled via ScrapeCreators API (profile + hashtag/keyword search), 2026-09-17.

## Method

Deeksha's own bio/content signals three overlapping interest areas: **sarkari-job/office-life humor** (her `@aso_chronicals` persona — she's a Section Officer, GoI), and **travel / fitness / books / creative lifestyle** (her `@deeksha.singhal200` persona). Search covered both:
- Hashtags: `#SarkariNaukri`, `#GovtEmployee`
- Keyword/reel search: "SSC CGL relatable office", "bookstagram reels India", "solo travel India girl reels", "gym girl India relatable fitness"

Candidates were filtered for real engagement (not follower count alone) and ranked to keep a spread from mega accounts (ceiling references) down to accounts at her exact career stage (near-term, copyable references).

## The 20

| Handle | Followers | Niche | Tier | Engagement* |
|---|---:|---|---|---:|
| [@sarkari_karamchari2207](https://www.instagram.com/sarkari_karamchari2207/) | 2,812 | Sarkari-job/office-life | **Closest peer** | 33.1% |
| [@beyond_the_files](https://www.instagram.com/beyond_the_files/) | 11,378 | Sarkari-job/office-life | Peer | 40.5% |
| [@theglobalhues](https://www.instagram.com/theglobalhues/) | 13,604 | Media/magazine | Small | 0.14%† |
| [@shri_reads_books](https://www.instagram.com/shri_reads_books/) | 33,767 | Bookstagram | Mid | 29.9% |
| [@aso_prashantrana](https://www.instagram.com/aso_prashantrana/) | 45,608 | Sarkari-job/office-life | Mid | n/a† |
| [@aso_naresh_gautam](https://www.instagram.com/aso_naresh_gautam/) | 55,671 | Sarkari-job + mentorship | Mid | 0.97% |
| [@iam._shazy](https://www.instagram.com/iam._shazy/) | 67,806 | Motivation/storytelling | Mid | 5.96% |
| [@hrsh_verse](https://www.instagram.com/hrsh_verse/) | 74,732 | Fitness/travel + office memes | Mid | n/a† |
| [@shreya.xplores](https://www.instagram.com/shreya.xplores/) | 92,775 | Sarkari-job + travel | **Closest 1:1 match** | n/a† |
| [@the_mars___](https://www.instagram.com/the_mars___/) | 139,207 | Sarkari-job/office-life | Mid | 3.4% |
| [@naikita.bali](https://www.instagram.com/naikita.bali/) | 217,052 | Solo travel | High | 27.2% |
| [@ydvsuraj_62](https://www.instagram.com/ydvsuraj_62/) | 228,454 | Sarkari-job/office-life | Mid | 3.6% |
| [@selfeducorner](https://www.instagram.com/selfeducorner/) | 194,707 | Books/dark academia | High | 12.5% |
| [@abe_rozgar](https://www.instagram.com/abe_rozgar/) | 456,980 | Sarkari-job comedy | Top | 4.1% |
| [@varshana_rana](https://www.instagram.com/varshana_rana/) | 611,072 | Fitness | Top | 14.0% |
| [@kavirohitsharma](https://www.instagram.com/kavirohitsharma/) | 691,924 | Comic poetry | Top | 1.4% |
| [@nishantkapoor3995](https://www.instagram.com/nishantkapoor3995/) | 834,497 | Fitness + govt identity | Top | 2.6% |
| [@harshdixit1420](https://www.instagram.com/harshdixit1420/) | 921,885 | Sarkari-job/office-life | Top | 8.1% |
| [@jhony_pandey](https://www.instagram.com/jhony_pandey/) | 1,137,611 | General relatable/comedy | Mega | 26.8% |
| [@itsaartisahu](https://www.instagram.com/itsaartisahu/) | 4,364,114 | Fitness | Mega | 0.52% |

\* Engagement rate = (likes + comments on a sampled recent post) ÷ followers. Directional only — based on 1-2 sampled posts per account, not a full history. The dashboard's ingestion cron (Phase 3) will replace this with real per-account averages over time.
† Insufficient/unreliable sample.

## What this tells us

**1. The "govt job girlie" niche is real and it's not small.** At least 8 of the 20 post specifically about sarkari-naukri/office life, ranging from 2.8K to 921K followers. This isn't a niche Deeksha would be inventing — it has an established audience and proven formats.

**2. Two accounts are unusually close matches:**
- **@sarkari_karamchari2207** (2,812 followers, "Section Officer | GOI") — same job title, same career stage as @aso_chronicals right now. The clearest "this is achievable soon" reference.
- **@shreya.xplores** (92,775 followers, "Govt job girlie — exploring life, beyond the desk") — the exact combination Deeksha already has across her two accounts (government job identity + travel/exploring). Her single biggest post (576K likes) is a **personal origin-story caption** ("Clearing SSC CGL in my first attempt changed my life..."), not a meme — worth noting since most of the niche leans on humor.

**3. Recurring content formats that work in this niche:**
- Relatable office/government-life memes tied to trending audio or moments (Diwali holidays, "section me sab bade log hain")
- "Day/Sunday in my life" vlogs (aso_prashantrana)
- Personal journey/origin-story posts ("how I cleared the exam") — can outperform memes when done well
- "Cracked the exam → now I mentor/teach" arc (aso_naresh_gautam, ydvsuraj_62) — a monetization path once an audience exists

**4. Her other interests have their own proven playbooks:**
- Solo travel: @naikita.bali runs a recurring themed weekly series ("Sunday Club") — a repeatable format Deeksha could adapt for her Ladakh-style content
- Books: @selfeducorner and @shri_reads_books show a "dark academia"/literary-aesthetic niche sustains 12-30% engagement at 30K-200K followers — her bibliophile bio line could become a real content pillar, not just occasional mentions
- Fitness: @varshana_rana shows the "gym rat" identity can extend into brand partnerships (nutrition brand code) at scale

**5. Engagement rate compresses at scale, as expected** — mega accounts (@itsaartisahu at 4.3M, 0.52%) run far lower engagement % than small/mid accounts, which is normal and not a red flag for those creators.

## Next: Phase 2

This dataset becomes the seed data for the dashboard's Neon database. Moving on to scaffolding the Next.js app.
