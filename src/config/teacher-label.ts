const TeacherLabel: { [index: string]: string } = {
    teacher_id: "教职工号",
    name: "姓名",
    sex: "性别",
    email: "邮箱",
};

const getKey = (value: any) => {
    for (let key in TeacherLabel) {
        if (TeacherLabel[key] === value) {
            return key;
        }
    }
};

export {
    TeacherLabel,
    getKey,
};