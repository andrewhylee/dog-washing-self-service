---
description: Re-publish this site to its existing dedicated here.now URL — never creates a new URL.
---

Redeploy this site to by re-publishing its static build to the EXISTING dedicated here.now URL for the current branch. You are FORBIDDEN from creating a brand-new here.now site / URL.

This is an authenticated, in-place update only.

## Preconditions (verify, then stop if unmet)

1. The here.now API key must exist at `~/.herenow/credentials` (the publish script reads it automatically). If missing, tell the user how to set it up and stop.
2. The dedicated-URL mapping must exist at `.herenow/urls.json` (JSON: `{ "<branch>": { "slug": "...", "siteUrl": "https://....here.now/" } }`). If the file is missing, report that no dedicated URL is tracked for this repo and stop — do not publish.

## Steps

1. Determine the current branch:
   ```bash
   git branch --show-current
   ```

2. Look up that branch in `.herenow/urls.json`. 
   - If the current branch is not present, do NOT publish. Tell the user no dedicated here.now URL exists for branch `X` and that a URL must be created (e.g. a one-time authenticated publish recorded into `.herenow/urls.json`) before /redeploy can run. Stop.

3. Confirm the dedicated URL still exists: call the account API and verify the slug is present:
   ```bash
   curl -sS https://here.now/api/v1/publishes -H "authorization: Bearer $(cat ~/.herenow/credentials)"
   ```
   - If the slug is missing from the account's `publishes`, the dedicated URL no longer exists. Report this and stop — do not create a new one.

4. Build the static export fresh:
   ```bash
   npm run build
   ```
   (The exported site is written to `out/`.)

5. Update the dedicated site in place using its stored slug (the publish script reads the API key from `~/.herenow/credentials`):
   ```bash
   bash ~/.claude/skills/here-now/scripts/publish.sh "$PWD/out" --slug <slug> --client opencode
   ```

6. Validate the result:
   - `publish_result.action` MUST be `update`. If it is `create` (or the script printed a different URL), abort and report — that means a new URL was (or would be) created, which is disallowed.
   - The returned `publish_result.site_url` MUST equal the dedicated `siteUrl` from the mapping (same slug, same host). If it differs, abort and report.
   - Confirm the live URL responds with 200:
     ```bash
     curl -s -o /dev/null -w "%{http_code}" <siteUrl>
     ```

## Hard rules

- NEVER invoke publish.sh without `--slug <existing slug>`. Omitting `--slug` is exactly how a brand-new URL gets created, and that is forbidden for /redeploy.
- Never pass `--overwrite`; in-place updates are concurrency-checked by the server, which is what we want.
- The URL must remain byte-for-byte unchanged after /redeploy.

## Report

Share the live URL on its own line (the dedicated URL, unchanged). State that it was updated in place and no new URL was created.