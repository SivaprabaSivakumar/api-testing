import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';


let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R,
            shouldBeLessThanOrEqual(expected: T): R
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any) {
        let pass: boolean;

        let logs: string = ''
        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentLogs();
            }

        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }
        const hint = this.isNot ? 'not' : '';
        const message = pass
            ? () => this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
                '\n\n' +
                `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}` : '' +
            `Recent API Activity:\n${logs}`


        return {
            message,
            pass
        };

    },
    shouldBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean;

        let logs: string = ''
        try {
            baseExpect(received).toBeLessThanOrEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentLogs();
            }

        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }
        const hint = this.isNot ? 'not' : '';
        const message = pass
            ? () => this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
                '\n\n' +
                `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}` : '' +
            `Recent API Activity:\n${logs}`


        return {
            message,
            pass
        };

    }
})
