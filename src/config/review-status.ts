const reviewStatus: { [index: string]: number } = {
    "未审核": 0,
    "审核中": 1,
    "审核通过": 2,
    "审核驳回": 3,
};

const getType = (index: any) => {
    for (let key in reviewStatus) {
        if (reviewStatus[key] === index) {
            return key;
        }
    }
};

export {
    reviewStatus,
    getType,
};