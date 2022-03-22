import * as XLSX from 'xlsx';

const SheetToJson = (file: any, getKey: any) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e: any) => {
            const f = e.target.result;
            const workbook = XLSX.read(f, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            const data = json.map((item: any) => {
                return Object.keys(item).reduce((newData: any, value: any) => {
                    if (!getKey(value)) {
                        return newData;
                    }

                    const newValue: any = getKey(value);
                    if (value === "性别") {
                        newData[newValue] = item[value] === "女" ? 1 : 0;
                    } else {
                        newData[newValue] = item[value];
                    }
                    return newData;
                }, {});
            });

            resolve(data);
        };
    })
};

export default SheetToJson;