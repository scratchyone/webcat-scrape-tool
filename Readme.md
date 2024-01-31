# UNH WebCat Scrape Tool

This tool uses Playwright to scrape the "Look up courses to add" page on UNH WebCat. It's meant to gather data about class capacity. It expects the following environment variables:

```env
EMAIL=the unh email to login with
PASSWORD=the password of the unh account to log in with
TOTP=the TOTP secret used to generate 6-digit codes for 2FA
PASSWD=the password used to authenticate with the Cloudflare worker that processes the scraped data
```

It works alongside a Cloudflare worker to process the scraped HTML and provide an API for looking up course information.
