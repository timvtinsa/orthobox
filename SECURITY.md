# Security policy

Orthobox is a 100% client-side application: there is no server, no account,
and no patient data ever leaves the browser (see the README). That narrows
what a vulnerability here can be, but does not rule it out — an XSS through a
shared link, a dependency with a known CVE, or a GitHub Actions workflow
issue are all in scope.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting rather than a public
issue: open the **Security** tab on this repository, then **Report a
vulnerability**. That reaches the maintainer directly and keeps the report
private until a fix is out.

If that option is not available on this repository yet, a public issue with
as little exploit detail as possible, or a note asking to be pointed to a
private channel, is a reasonable fallback.

## Supported versions

Only the latest release is supported. There is no long-term maintenance
branch: `CHANGELOG.md` tracks what shipped, and a fix lands in the next
release rather than being backported.
