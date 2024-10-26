import {PageMode} from "./PageMode.ts";
import {Article} from "./Article.ts";

export interface PageStatus {
    mode: PageMode;
    editingArticle? : Article,
    article: Article;
}