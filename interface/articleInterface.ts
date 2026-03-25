export interface Article {
    title: string;
    description: string;
    body: string;
    tagList: string[];
}


//if there is only one interface in the file
// export default interface Article {
//     title: string;
//     description: string;
//     body: string;
//     tagList: string[];
// }

// shriram gave this solution
// interface Article {
//     title: string;
//     description: string;
//     body: string;
//     tagList: string[];
// }

// export default { Article }

// type Article = {
//     title: string;
//     description: string;
//     body: string;
//     tagList: string[];
// };

// export default Article;