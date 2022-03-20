interface StudentDetail {
    id: string,
    User: {
        user_id: string,
    },
    name: string,
    file_id?: number,
    file_url?: string,
    isPush?: boolean,
    isFinish?: boolean,
    push_status?: string,
}