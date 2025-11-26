# Stytch Authentication

This extension adds passwordless authentication using Stytch to your application. Stytch provides a modern authentication platform with support for email magic links, SMS passcodes, OAuth, and more - all without requiring users to remember passwords.

## Prerequisites

Before configuring this extension, you need to:
1. Create a free Stytch account at https://stytch.com
2. Create a Stytch Project
3. Get your Project ID, Secret, and Public Token

## How to Create a Stytch Account and Project

### 1. Sign up for Stytch

1. Go to https://stytch.com/start-now
2. Click "Start Building" or "Sign Up"
3. Enter your email address
4. You'll receive a magic link - click it to verify your email
5. Complete your account setup

### 2. Create a New Project

1. After logging in, you'll be prompted to create a project
2. Enter your project name (e.g., "My App")
3. Choose your project type:
   - **Consumer**: For B2C applications (individual users)
   - **B2B**: For B2B applications (organizations with members)
4. Click "Create Project"

### 3. Get Your Credentials

After creating your project, you'll see your credentials:
- **Project ID**: Starts with `project-live-` or `project-test-`
- **Secret**: Your backend secret key
- **Public Token**: Starts with `public-token-live-` or `public-token-test-`

**Test vs Live Environment:**
- Use `project-test-*` credentials for development
- Use `project-live-*` credentials for production
- Switch between them in Settings → API Keys

### 4. Configure Authentication Methods

1. Go to **Configuration → Authentication** in the Stytch Dashboard
2. Enable your preferred authentication methods:
   - **Email Magic Links** (recommended for getting started)
   - **SMS Passcodes**
   - **OAuth** (Google, Microsoft, GitHub, etc.)
   - **Passwords** (optional - for traditional login)
   - **WebAuthn/Biometrics**
3. Configure redirect URLs:
   - **Development**: `http://localhost:5173/authenticate`
   - **Production**: `https://yourapp.com/authenticate`

---

## Configuration Fields

### Scaffold Configuration

These settings are configured once during project generation.

#### Enable Role-Based Access Control `enableRbac`
**What it is**: Determines whether to include role-based permissions in your application (e.g., admin users vs regular users).

**Options**:
- `true` (default): Users can have roles like "admin", "user", "moderator"
- `false`: All authenticated users have the same permissions

**When to use**:
- Enable if you need different permission levels (recommended)
- Disable if all users should have identical access

---

#### Role Claim Key `roleClaimKey`
**What it is**: The name of the field in the session JWT where user roles are stored.

**Default value**: `roles`

**How Stytch Roles Work**:
- For **Consumer projects**: Use custom attributes to store roles
- For **B2B projects**: Use built-in Member roles
- Roles are included in the session JWT under this claim name

**Setting up roles in Stytch**:
1. Go to **Configuration → Attributes** (Consumer) or **Members** (B2B)
2. Add a custom attribute/field for roles
3. Use Stytch's API to set roles when creating/updating users
4. Access roles from the session JWT

---

#### Tenant ID Claim Key `tenantIdClaimKey`
**What it is**: For B2B applications, the field name where the organization ID is stored in the token.

**Default value**: `organization_id` (Stytch B2B default)

**When to use**:
- **Leave default** for B2B applications using Stytch Organizations
- **Leave empty** for Consumer applications (single-tenant)
- **Customize** if using custom organization structure

**Stytch B2B Organizations**:
- Each user belongs to one or more organizations
- `organization_id` is automatically included in B2B session tokens
- Use for multi-tenant SaaS applications

---

### Runtime Configuration

These are the credentials from your Stytch project.

#### Stytch Project ID `STYTCH_PROJECT_ID`
**What it is**: Your unique Stytch project identifier.

**How to find it**:
1. Log into Stytch Dashboard
2. Go to **Settings → API Keys**
3. Look for "Project ID"
4. Copy the project ID (e.g., `project-live-abcd1234-5678-90ef-ghij-klmnopqrstuv`)

**Format**: `project-{env}-{uuid}` where env is `test` or `live`

**Environments**:
- `project-test-*`: For development and testing
- `project-live-*`: For production

**Usage**: Required by both frontend and backend

---

#### Stytch Secret `STYTCH_SECRET`
**What it is**: Your backend secret key for authenticating API requests.

**How to find it**:
1. Log into Stytch Dashboard
2. Go to **Settings → API Keys**
3. Look for "Secret"
4. Click "Reveal" to see the secret
5. Copy it (e.g., `secret-live-xxxxx...`)

**Format**: `secret-{env}-{string}`

**Security Warning**:
- **NEVER** expose this in client-side code
- Store it as an environment variable
- Only use it in backend code
- Rotate it immediately if compromised

**Usage**: Backend only (Spring Boot, Django/DRF)

---

#### Stytch Public Token `STYTCH_PUBLIC_TOKEN`
**What it is**: Your frontend public token for initializing the Stytch SDK.

**How to find it**:
1. Log into Stytch Dashboard
2. Go to **Settings → API Keys**
3. Look for "Public Token"
4. Copy it (e.g., `public-token-live-xxxxx...`)

**Format**: `public-token-{env}-{string}`

**Usage**: Frontend only (React)

**Security**: Safe to include in client-side code (it's public by design)

---

## How It Works

### Authentication Flow (Email Magic Link Example)

1. **User enters email** → Frontend sends request to Stytch
2. **Stytch sends magic link email** → User receives email
3. **User clicks link** → Redirects to your app with token
4. **Frontend exchanges token** → Gets session token and JWT
5. **Frontend stores session** → In cookie or localStorage
6. **Frontend sends API requests** → Includes session JWT in Authorization header
7. **Backend validates session** → Verifies JWT with Stytch SDK
8. **Backend syncs user** → Creates/updates user in local database with roles
9. **Backend returns data** → Protected endpoint accessible

### Session Management

Stytch sessions are valid for a configurable duration (default: 30 days):
- **Session Token**: Opaque token stored in cookie
- **Session JWT**: JSON Web Token with user claims
- Sessions can be refreshed automatically
- Logout invalidates the session

### Passwordless Authentication Methods

**Email Magic Links**:
- User enters email
- Receives a magic link
- Clicks link to authenticate
- No password needed

**SMS Passcodes**:
- User enters phone number
- Receives a 6-digit code
- Enters code to authenticate

**OAuth**:
- User clicks "Sign in with Google" (or other provider)
- Redirected to OAuth provider
- Approves permissions
- Redirected back authenticated

---

## Common Issues

### "Invalid public token" Error
**Problem**: Public token is incorrect or from wrong environment.

**Solutions**:
- Verify public token in Stytch Dashboard → Settings → API Keys
- Ensure you're using the correct environment (test vs live)
- Check for extra spaces when copying
- Make sure it starts with `public-token-`

### "Authentication failed" Error
**Problem**: Session token is invalid or expired.

**Solutions**:
- Check session expiration settings in Stytch Dashboard
- Verify user is authenticated before making API calls
- Implement session refresh logic
- Check network requests in browser DevTools

### "Secret key invalid" Error (Backend)
**Problem**: Backend secret is wrong or exposed.

**Solutions**:
- Verify secret in Stytch Dashboard → Settings → API Keys
- Ensure secret matches environment (test vs live)
- Check environment variables are loaded correctly
- Rotate secret if it was exposed

### Magic Links Not Working
**Problem**: User doesn't receive magic link email.

**Solutions**:
- Check email is correctly spelled
- Look in spam/junk folder
- Verify email settings in Stytch Dashboard → Configuration → Email
- For production, configure custom email domain
- Check Stytch logs for delivery status

### OAuth Redirect Fails
**Problem**: OAuth redirect URI mismatch.

**Solutions**:
- Add redirect URI in Stytch Dashboard → Configuration → Redirect URLs
- Format: `http://localhost:5173/authenticate` (dev) or `https://yourapp.com/authenticate` (prod)
- Must be exact match (including trailing slash if present)
- For OAuth providers, ensure redirect URI is also configured on their side

---

## Best Practices

1. **Security**:
   - Use `project-live-` and `secret-live-` for production only
   - Never commit secrets to version control
   - Rotate secrets regularly
   - Use HTTPS in production
   - Implement session timeout

2. **User Experience**:
   - Enable multiple authentication methods (email + OAuth)
   - Customize email templates with your branding
   - Provide clear error messages
   - Implement loading states
   - Allow users to manage their authentication methods

3. **Development**:
   - Use test environment for development
   - Test with multiple authentication methods
   - Implement proper error handling
   - Add logging for debugging
   - Test session expiration scenarios

4. **Production**:
   - Configure custom email domain for magic links
   - Set up monitoring and alerts
   - Implement rate limiting
   - Review Stytch audit logs regularly
   - Have session management strategy

---

## Testing Your Setup

### 1. Test Magic Link Flow

1. Start your application
2. Enter your email address
3. Check your email inbox
4. Click the magic link
5. You should be redirected back to your app, authenticated

### 2. Test API Access

1. Authenticate via magic link
2. Open browser developer console (F12)
3. Go to Network tab
4. Make an API request to a protected endpoint
5. Check request headers - should include session JWT
6. Check response - should return data (not 401)

### 3. Test Session Persistence

1. Authenticate
2. Close your browser
3. Reopen and visit your app
4. You should still be authenticated (session persisted)

---

## Additional Resources

- **Stytch Documentation**: https://stytch.com/docs
- **Stytch Dashboard**: https://stytch.com/dashboard
- **Java SDK**: https://github.com/stytchauth/stytch-java
- **React SDK**: https://github.com/stytchauth/stytch-react
- **Python SDK**: https://github.com/stytchauth/stytch-python
- **API Reference**: https://stytch.com/docs/api
- **Community Forum**: https://forum.stytch.com
- **Support**: support@stytch.com
