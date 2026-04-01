export declare class CreateReviewDto {
    productId: string;
    authorId: string;
    authorName: string;
    rating: number;
    body: string;
}
export declare class CreateReplyDto {
    authorId: string;
    authorName: string;
    body: string;
}
export declare class LikeReviewDto {
    userId: string;
}
