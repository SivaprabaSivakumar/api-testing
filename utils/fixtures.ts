import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger, expect } from './custom-expect';

export { expect }
export type TestOptions = {
    api: RequestHandler
}

export const test = base.extend<TestOptions>({
    api: async ({ request }, use) => {
        const baseURL = 'https://conduit-api.bondaracademy.com/api'
        const logger = new APILogger;
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, baseURL, logger)
        await use(requestHandler)
    }
})
