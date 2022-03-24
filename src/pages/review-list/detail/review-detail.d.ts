interface ReviewDetailData {
    id: number,
    file_name: string,
    file_url: string,
    Student: {
        name: string,
    },
    Stage: {
        name: string,
    },
    status: number,
    createdAt: string,
    file_detail?: string,
    review?: string,
    review_at?: string,
    is_review: boolean,
};