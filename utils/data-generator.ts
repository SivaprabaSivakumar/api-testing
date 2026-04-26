import articleRequestPayload from '../request-objects/POST-article.json';
import { ar, faker } from '@faker-js/faker';

export function getRandomArticle() {
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(10)
    articleRequest.article.body = faker.lorem.paragraph(8)
    return articleRequest
}