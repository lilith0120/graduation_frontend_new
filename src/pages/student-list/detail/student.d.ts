interface StudentData {
    name: string,
    grade: string,
    Profession: {
        name: string,
    },
    sex: string,
    User: {
        email: string,
        user_id: string,
    },
    Teacher?: {
        name: string,
    },
    Stage?: {
        name: string,
    },
    StageId?: number;
    review_teacher?: string,
    group_teacher?: Array,
}