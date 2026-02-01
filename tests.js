/**
 * Genesis3 Module Test Configuration - Stytch Authentication Extension
 *
 * Tests the complete Stytch passwordless authentication including:
 * - Spring Boot JWT validation and user sync
 * - React Stytch SDK integration
 * - Django JWT validation and user sync
 * - Magic links and OTP authentication
 * - RBAC integration
 * - Provider compatibility (AWS and DigitalOcean)
 */

module.exports = {
  moduleId: 'extension-stytch',
  moduleName: 'Stytch Authentication',

  scenarios: [
    {
      name: 'stytch-spring-boot-complete',
      description: 'Stytch with Spring Boot - complete integration with user sync',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'stytch-spring',
        kind: 'extension',
        type: 'stytch',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true,
          roleClaimKey: 'roles',
          tenantIdClaimKey: 'organization_id'
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityStytchConfig.java',
        'backend/src/main/java/com/example/config/StytchAuthenticationToken.java',
        'backend/src/main/java/com/example/security/StytchUserSyncFilter.java',
        'backend/src/main/resources/application-stytch.yaml'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/config/SecurityStytchConfig.java',
          contains: [
            'SecurityFilterChain',
            '@Profile("stytch")',
            'StytchUserSyncFilter'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/security/StytchUserSyncFilter.java',
          contains: [
            'StytchUserSyncFilter',
            'OncePerRequestFilter',
            'UserService',
            'createOrUpdateUser'
          ]
        },
        {
          file: 'backend/src/main/resources/application-stytch.yaml',
          contains: [
            'stytch:',
            'project-id:',
            'secret: ${STYTCH_SECRET:}'
          ]
        }
      ]
    },
    {
      name: 'stytch-spring-without-rbac',
      description: 'Stytch with Spring Boot - without RBAC integration',
      config: {
        moduleId: 'stytch-spring-simple',
        kind: 'extension',
        type: 'stytch',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: false
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityStytchConfig.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/config/SecurityStytchConfig.java',
          contains: [
            'SecurityFilterChain',
            '@Profile("stytch")'
          ]
        }
      ]
    },
    {
      name: 'stytch-react-complete',
      description: 'Stytch with React - complete passwordless integration',
      config: {
        moduleId: 'stytch-react',
        kind: 'extension',
        type: 'stytch',
        providers: ['react'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true,
          roleClaimKey: 'roles'
        }
      },
      expectedFiles: [
        'frontend/src/providers/StytchProvider.tsx',
        'frontend/src/components/LoginForm.tsx',
        'frontend/src/utils/apiClient.ts',
        'frontend/src/hooks/useStytchAuth.ts',
        'frontend/src/pages/StytchCallback.tsx',
        'frontend/src/pages/Profile.tsx',
        'frontend/.env'
      ],
      fileContentChecks: [
        {
          file: 'frontend/src/providers/StytchProvider.tsx',
          contains: [
            'StytchProvider',
            '@stytch/react',
            'VITE_STYTCH_PUBLIC_TOKEN'
          ]
        },
        {
          file: 'frontend/src/hooks/useStytchAuth.ts',
          contains: [
            'useStytchUser',
            'useStytchSession',
            'isAuthenticated'
          ]
        },
        {
          file: 'frontend/src/components/LoginForm.tsx',
          contains: [
            'StytchLogin',
            'magicLinks',
            'otp'
          ]
        },
        {
          file: 'frontend/.env',
          contains: [
            'VITE_STYTCH_PUBLIC_TOKEN'
          ]
        }
      ]
    },
    {
      name: 'stytch-fullstack-spring-react',
      description: 'Stytch full-stack with Spring Boot and React',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'stytch-fullstack',
        kind: 'extension',
        type: 'stytch',
        providers: ['spring', 'react'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true,
          roleClaimKey: 'roles',
          tenantIdClaimKey: 'organization_id'
        }
      },
      expectedFiles: [
        // Backend
        'backend/src/main/java/com/example/config/SecurityStytchConfig.java',
        'backend/src/main/java/com/example/security/StytchUserSyncFilter.java',
        'backend/src/main/resources/application-stytch.yaml',
        // Frontend
        'frontend/src/providers/StytchProvider.tsx',
        'frontend/src/hooks/useStytchAuth.ts',
        'frontend/src/pages/Profile.tsx'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/security/StytchUserSyncFilter.java',
          contains: ['StytchUserSyncFilter', 'createOrUpdateUser']
        },
        {
          file: 'frontend/src/hooks/useStytchAuth.ts',
          contains: ['useStytchUser', 'isAuthenticated']
        }
      ]
    },
    {
      name: 'stytch-drf-complete',
      description: 'Stytch with Django REST Framework',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'stytch-drf',
        kind: 'extension',
        type: 'stytch',
        providers: ['drf'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true,
          roleClaimKey: 'roles'
        }
      },
      expectedFiles: [
        'backend/auth/authentication.py',
        'backend/auth/permissions.py',
        'backend/auth/__init__.py'
      ],
      fileContentChecks: [
        {
          file: 'backend/auth/authentication.py',
          contains: [
            'stytch',
            'STYTCH_PROJECT_ID',
            'STYTCH_SECRET'
          ]
        }
      ]
    },
    {
      name: 'stytch-with-aws-provider',
      description: 'Stytch extension with AWS provider',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'stytch-aws',
        kind: 'extension',
        type: 'stytch',
        providers: ['spring', 'aws'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityStytchConfig.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/resources/application-stytch.yaml',
          contains: [
            'STYTCH_SECRET'
          ]
        }
      ]
    },
    {
      name: 'stytch-with-digitalocean-provider',
      description: 'Stytch extension with DigitalOcean provider',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'stytch-do',
        kind: 'extension',
        type: 'stytch',
        providers: ['spring', 'digitalocean'],
        enabled: true,
        fieldValues: {
          stytchProjectId: 'project-test-xxxxx',
          stytchPublicToken: 'public-token-test-xxxxx',
          enableRbac: true
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityStytchConfig.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/resources/application-stytch.yaml',
          contains: [
            'STYTCH_SECRET'
          ]
        }
      ]
    }
  ],

  templateValidations: [
    {
      name: 'stytch-profile-annotation',
      template: 'extension-stytch/code-spring/src/main/java/{{packagePath}}/config/SecurityStytchConfig.java.mustache',
      contains: ['@Profile("stytch")'],
      reason: 'Configuration: Stytch beans should only load when profile is active'
    },
    {
      name: 'stytch-secret-not-hardcoded',
      template: 'extension-stytch/code-spring/src/main/resources/application-stytch.yaml.mustache',
      contains: ['${STYTCH_SECRET:}'],
      notContains: ['secret-live-', 'secret-test-'],
      reason: 'Security: Stytch secret must come from environment, never hardcoded'
    },
    {
      name: 'frontend-uses-public-token-only',
      template: 'extension-stytch/code-react/src/providers/StytchProvider.tsx.mustache',
      contains: ['VITE_STYTCH_PUBLIC_TOKEN'],
      notContains: ['STYTCH_SECRET', 'secret-'],
      reason: 'Security: Frontend must only use public token, never the secret'
    },
    {
      name: 'user-sync-filter-present',
      template: 'extension-stytch/code-spring/src/main/java/{{packagePath}}/security/StytchUserSyncFilter.java.mustache',
      contains: ['createOrUpdateUser', 'UserService'],
      reason: 'Feature: User sync filter should sync Stytch users to local database'
    }
  ]
};
