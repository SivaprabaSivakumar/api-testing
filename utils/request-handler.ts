import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "./logger";

export class RequestHandler {

    private request: APIRequestContext;
    private logger: APILogger
    private baseUrl: string | undefined
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParam: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, baseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultBaseUrl = baseUrl;
        this.logger = logger;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    param(param: object) {
        this.queryParam = param;
        return this;
    }

    headers(headers: object) {
        //gets error because of object type
        //this.apiHeaders = headers;
        //used this to resolve error
        this.apiHeaders = headers as Record<string, string>;

        return this;
    }

    body(body: object) {
        this.apiBody = body;
        return this;
    }

    async getRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('GET', url, this.apiHeaders, this.apiBody);
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        this.cleanUpFields();
        const actualStatus = response.status()
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        return responseJSON;
    }

    async postRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        this.cleanUpFields();
        const actualStatus = response.status()
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest)

        return responseJSON;
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        this.cleanUpFields();
        const actualStatus = response.status()
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
        return responseJSON;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.apiHeaders)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        })
        this.cleanUpFields();
        const actualStatus = response.status()

        this.logger.logResponse(actualStatus)
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
    }
    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParam)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Status code mismatch: Expected ${expectedStatus}, got ${actualStatus}\n\n Recent API Activity:\n ${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error;
        }
    }

    private cleanUpFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.baseUrl = undefined;
        this.apiPath = '';
        this.queryParam = {};

    }
}