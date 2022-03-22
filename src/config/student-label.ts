const StudentLabel: { [index: string]: string } = {
    student_id: "学号",
    name: "姓名",
    sex: "性别",
    email: "邮箱",
    grade: "年级",
    profession_name: "专业",
    teacher_name: "指导老师",
    stage_name: "毕业设计阶段",
};

const getKey = (value: any) => {
    for (let key in StudentLabel) {
        if (StudentLabel[key] === value) {
            return key;
        }
    }
};

export {
    StudentLabel,
    getKey,
};