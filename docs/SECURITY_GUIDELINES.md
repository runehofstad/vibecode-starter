# 🔒 Security Guidelines - Vibecode Starter

## Authentication
- Use Supabase Auth for user authentication
- Enforce strong password policies
- Support OAuth providers where possible
- Use secure token storage (httpOnly cookies or secure storage on mobile)

## API Security
- Use HTTPS for all API requests
- Validate all incoming data on the server
- Implement rate limiting on critical endpoints
- Use Role-Based Access Control (RBAC) for sensitive actions
- Enable Row Level Security (RLS) in Supabase

## Data Validation
- Validate all user input on both client and server
- Use zod or yup for schema validation in forms
- Sanitize data before storing or displaying

## Environment Variables
- Never commit secrets to the repository
- Use .env files for local development
- Store production secrets in CI/CD or cloud secret managers

## GDPR & Privacy
- Only collect necessary user data
- Provide clear privacy policy and terms of service
- Allow users to delete their account and data
- Anonymize or pseudonymize personal data where possible
- Use cookie consent banners for tracking

## Security Headers
- Set Content Security Policy (CSP)
- Use X-Frame-Options: DENY
- Set X-Content-Type-Options: nosniff
- Use Strict-Transport-Security

## Vulnerability Scanning
- Use npm audit and GitHub Dependabot for dependency scanning
- Run security checks in CI/CD pipeline

## Best Practices
- Keep all dependencies up to date
- Regularly review and rotate secrets
- Log security events and monitor for suspicious activity
- Educate team on social engineering and phishing risks 