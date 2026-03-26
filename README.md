# Test suite
- [Playwright](https://playwright.dev/docs)

# Decisions
- used custom expect for better error messages
- used fixtures to reduce code duplication
- used config file to store environment variables
- used logger to log requests and responses
- used request handler to handle request
- used waitUtils
- used faker to generate test data
- used the custom assertions 

# Installation
`npm install`
`node i`
`npx playwright install`

# Run
To run tests in qa environment
`ENV=qa npx playwright test smokeTest.spec.ts`

To run tests in prod environment
`ENV=prod npx playwright test smokeTest.spec.ts`

To run tests in dev environment
`ENV=dev npx playwright test smokeTest.spec.ts`

To run project wise tests
`npx playwright test --project smoke-test`

# Report Generation
`npx playwright show-report`

# Reference
- Custom assertions : [documentation](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend)

- Report : [documentation](https://playwright.dev/docs/test-reporters)