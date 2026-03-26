## Description

Adds OAuth2 authentication support using the authorization code flow with
access and refresh tokens. The implementation introduces OAuth endpoints,
extends protected routes to accept bearer tokens, documents the required
configuration, and adds automated coverage for the new auth flow.

## Related Issue

Fixes #59

## Type of Change

- [ ] Bug fix
- [x] New feature
- [x] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made

- Added OAuth2 authorization and token endpoints with JWT access tokens and rotating refresh tokens
- Updated auth middleware so protected routes accept either the existing admin API key or valid OAuth bearer tokens
- Added OAuth configuration to the environment example, documented the setup and flow in the README, and added automated tests for the new endpoints

## Testing

Tested with:

- `npm run lint`
- `npm run type-check`
- `npm test`

Also added focused automated coverage for the OAuth2 flow, including token
issuance, refresh handling, and bearer-token access to protected routes.

## Checklist

- [x] Code follows project style
- [x] Self-reviewed my code
- [ ] Commented complex code
- [x] Updated documentation
- [ ] No new warnings
- [x] Added tests (if applicable)

## Screenshots (if applicable)

N/A

## Additional Notes

It closes this issue:
https://github.com/sublime247/mobile-money/issues/59
