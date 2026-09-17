# Phase 1 Research — 20 Creators for Dee's Growth Dashboard

Source data: [`data/seed-creators.json`](../data/seed-creators.json). Pulled via ScrapeCreators API (profile + post-history sampling), 2026-09-17. **Revised after review round 1** to women-only, independent creators (no brands/media pages), replacing 13 of the original 20.

## Method

Deeksha's own bio/content signals three overlapping interest areas: **sarkari-job/office-life humor** (her `@aso_chronicals` persona — she's a Section Officer, GoI), and **travel / fitness / books / creative lifestyle** (her `@deeksha.singhal200` persona). Search covered both, filtered explicitly to women-run, independent accounts (no brands, no coaching institutes, no multi-author pages).

Engagement rate is now the **average of (likes + comments) / followers across each account's 12 most recently fetched posts** — a real average, not a single-post sample.

## The 20

| Handle | Followers | Niche | Tier | Avg. engagement |
|---|---:|---|---|---:|
| [@nikitahemanii](https://www.instagram.com/nikitahemanii/) | 2,080 | Sarkari-job + fashion | Peer | 15.7% |
| [@sarkari_karamchari2207](https://www.instagram.com/sarkari_karamchari2207/) | 2,812 | Sarkari-job/office-life | **Closest peer** | 30.9% |
| [@magslibraryyy](https://www.instagram.com/magslibraryyy/) | 6,003 | Books | Peer | 246.1% |
| [@sarkari.wife.corporate.life](https://www.instagram.com/sarkari.wife.corporate.life/) | 6,707 | Sarkari-job (spouse angle) | Peer | 4.2% |
| [@simplyy_garima](https://www.instagram.com/simplyy_garima/) | 7,686 | Sarkari-job/office-life | Peer | 30.6% |
| [@nithikuku](https://www.instagram.com/nithikuku/) | 7,471 | Travel/lifestyle | Peer | 69.3% |
| [@tws.shreya](https://www.instagram.com/tws.shreya/) | 10,248 | Sarkari-job/office-life | Peer | 86.3% |
| [@beyond_the_files](https://www.instagram.com/beyond_the_files/) | 11,378 | Sarkari-job/office-life | Peer | 11.7% |
| [@neharana5034](https://www.instagram.com/neharana5034/) | 19,299 | Sarkari-job/office-life | Mid | 160.0% |
| [@shreya.de_](https://www.instagram.com/shreya.de_/) | 21,781 | Travel | Mid | 25.9% |
| [@stutichangle](https://www.instagram.com/stutichangle/) | 27,411 | Books | Mid | 18.6% |
| [@shri_reads_books](https://www.instagram.com/shri_reads_books/) | 33,767 | Books | Mid | 57.5% |
| [@yaminisolanki_](https://www.instagram.com/yaminisolanki_/) | 90,455 | Sarkari-job (academic) | High | 3.5% |
| [@shreya.xplores](https://www.instagram.com/shreya.xplores/) | 92,775 | Sarkari-job + travel | **Closest 1:1 match** | 8.8% |
| [@_igpoojaa](https://www.instagram.com/_igpoojaa/) | 230,802 | Sarkari-job/office-life | Top | 12.7% |
| [@naikita.bali](https://www.instagram.com/naikita.bali/) | 217,052 | Travel (solo) | Top | 0.8% |
| [@imyadav_riya](https://www.instagram.com/imyadav_riya/) | 344,342 | Fitness + travel | Top | 3.4% |
| [@varshana_rana](https://www.instagram.com/varshana_rana/) | 611,072 | Fitness | Top | 65.4% |
| [@selfeducorner](https://www.instagram.com/selfeducorner/) | 194,707 | Books/dark academia | Top | 4.0% |
| [@anjurisinha](https://www.instagram.com/anjurisinha/) | 1,210,032 | Fitness/fashion | Mega | 4.7% |

## What this tells us

**1. The "sarkari job girlie" niche is real, women-led, and has real range.** From @sarkari_karamchari2207 (2.8K, same job title as Deeksha) up through @_igpoojaa (230K, "corporate slave turned sarkari naukar"), the niche supports accounts at every scale — and several distinct angles within it: the employee's own POV, a mentor/motivator angle, an academic-government variant (@yaminisolanki_), and even the officer's *spouse's* POV (@sarkari.wife.corporate.life).

**2. Two standout matches:**
- **@sarkari_karamchari2207** — same job title ("Section Officer | GOI"), same follower stage as @aso_chronicals right now.
- **@shreya.xplores** — "Govt job girlie, exploring life beyond the desk," 92.8K followers — the exact combination Deeksha already has across her two accounts. Her single biggest post (576K likes) is a personal origin-story caption, not a meme.

**3. Real averages (not single samples) reveal viral outliers are common in this niche.** Several accounts post average engagement well over 50% — @magslibraryyy (246%), @neharana5034 (160%), @tws.shreya (86%) — meaning individual posts are routinely reaching far beyond their existing follower base via Explore/hashtags, not just their own audience. That's a meaningful signal: strong niche content in this space has real breakout potential, not just steady engagement from existing followers.

**4. Career-switch narrative is a proven arc, told from multiple angles:**
- @tws.shreya and @_igpoojaa both frame it as "corporate girlie/slave turned sarkari" — same story, different voice
- @yaminisolanki_ shows the academic-government variant

**5. Her other interests have proven playbooks, now with women running every reference:**
- Travel: @naikita.bali's recurring "Sunday Club" series, @shreya.de_'s trek-focused content directly mirror Deeksha's Ladakh-style posts
- Books: @stutichangle (published author) and @magslibraryyy (books + a bookmark side-business) show the niche supports both storytelling and small commerce
- Fitness: @varshana_rana and @anjurisinha show the "gym rat" identity scaling into brand partnerships; @imyadav_riya adds an athletic-credential (national Judo player) angle

## Next: Phase 3

This dataset (plus each account's cached top-5 recent and top-5 all-time posts, in [`data/creator-posts.json`](../data/creator-posts.json)) becomes the seed for the dashboard's eventual Neon database.
