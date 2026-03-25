import { request } from "@playwright/test";
import { config } from "../config";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";

// export async function createToken(api: RequestHandler, email: string, password: string) {
//     const tokenResponse = await api
//         .path('/users/login')
//         .body({
//             "user": {
//                 "email": email,
//                 "password": password
//             }
//         })
//         .postRequest(200)
//     return 'Token ' + tokenResponse.user.token;
// }

export async function createToken(email: string, password: string) {
    const context = await request.newContext();
    const logger = new APILogger;
    const api = new RequestHandler(context, config.baseURL, logger)

    try {
        const tokenResponse = await api
            .path('/users/login')
            .body({
                "user": {
                    "email": email,
                    "password": password
                }
            })
            .postRequest(200)
        return 'Token ' + tokenResponse.user.token;
    } catch (error) {
        Error.captureStackTrace(error, createToken);
        throw error;
    } finally {
        await context.dispose();
    }


}
