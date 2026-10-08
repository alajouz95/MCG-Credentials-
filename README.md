# MCG Credentials

Live at **https://thisismcg.com**.

Plain HTML, CSS and JavaScript, with no build step. Please pull before you edit, because changes are also pushed from Claude.

## Links you can send
- `thisismcg.com/#for-Client-Name` shows "Prepared for Client Name" on the cover.
- `thisismcg.com/#show=social,digital,ai` pre-picks services, so the tour only shows those service slides, matching work and matching case studies.
- Both together: `thisismcg.com/#for-Client-Name&show=events,film`
- Service words for `show=`: brand, social, digital, media, influencers, film, events, malls, podcasts, ai.
- `#case-honda` opens a case study directly.

## Files
- `index.html`: the slides. Each slide is a `<section class="slide">`, in order.
- `styles.css`: all styles.
- `script.js`: navigation and every interactive part.
- `assets/`: photos and project images. Client logos are in `assets/logos/`. Video loops (if added) go here as `.mp4`.

## Switched-off slides
"Our story", "How we work", "What clients say" and "What do you need?" are still in `index.html` with `data-off="cut"`. Delete that attribute to bring one back.

## Where to edit (in script.js)
- `RESULTS`: case-study numbers. Real, confirmed figures only.
- `W`: every project (client, title, year, images, Instagram or LinkedIn link). Add `v:'assets/name.mp4'` to a project to show a silent video loop.
- `SV`: the ten services on the "What would you like to see?" slide.
- `SVD`: each service slide (headline, text, "good for", the four steps, highlight projects).
- `SVI`: which projects sit under which service.
- `RC`: the result cards on the Digital marketing slide.
- `CASES`: the 19 case studies (brief, what we did, result).
- `DEPS`: the seven in-house teams on the "Our team" slide.
- `AIT`: the three tiles on the AI department slide.
- `CL`: client logos. Sector codes:
  - `A` automotive
  - `F` finance
  - `R` real estate
  - `H` hospitality
  - `T` retail and tech
  - `P` public sector and education
