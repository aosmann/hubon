-- Seed curated templates (published=true)
-- Includes: hubon-minimal-1x1

begin;

insert into public.templates (slug, title, category, ratios, engine, schema, prompt, overlays, created_by, published)
values
(
  'hubon-minimal-1x1',
  'Hubon Minimal — 1:1',
  'social',
  array['1:1'],
  'image',
  -- schema
  '{
    "type":"object",
    "required":["headline","body","cta","ratio"],
    "properties":{
      "headline":{"type":"string","maxLength":60,"default":"Prompt it. Paste it. Post it."},
      "body":{"type":"string","maxLength":160,"default":"Generate on-brand content in seconds."},
      "cta":{"type":"string","default":"Try Hubon"},
      "ratio":{"type":"string","enum":["1:1"],"default":"1:1"},
      "useBrandLogo":{"type":"boolean","default":true}
    }
  }'::jsonb,
  -- prompt (locked guidance only)
  '{
    "role":"system",
    "content":"Minimalist, high-contrast flyer with generous whitespace, strong headline, subtle body, compact CTA zone. No gradients."
  }'::jsonb,
  -- overlays
  '{
    "badge":"top-right-logo",
    "footer":"*100% generated with hubon.ai"
  }'::jsonb,
  null,
  true
)
on conflict (slug) do nothing;

-- Example extra (optional "bold" layout)
insert into public.templates (slug, title, category, ratios, engine, schema, prompt, overlays, created_by, published)
values
(
  'guerilla-bold-square',
  'Guerilla Bold — Square',
  'social',
  array['1:1','4:5'],
  'image',
  '{
    "type":"object",
    "required":["headline","body","cta","ratio"],
    "properties":{
      "headline":{"type":"string","maxLength":40,"default":"Make em look twice."},
      "body":{"type":"string","maxLength":160,"default":"Punchy, high-contrast promo."},
      "cta":{"type":"string","default":"Go"},
      "ratio":{"type":"string","enum":["1:1","4:5"],"default":"1:1"},
      "useBrandLogo":{"type":"boolean","default":true},
      "accentColor":{"type":"string","format":"color-hex","nullable":true}
    }
  }'::jsonb,
  '{
    "role":"system",
    "content":"Striking, poster-like visual. Large headline block. Strong whitespace. No gradients."
  }'::jsonb,
  '{
    "badge":"square-top-left",
    "frame":"minimal",
    "footer":"*100% generated with hubon.ai"
  }'::jsonb,
  null,
  true
)
on conflict (slug) do nothing;

commit;
