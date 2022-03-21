import * as XLSX from 'xlsx';

const SheetToBlob = (selected: any, changeList: any) => {
    const data = selected.map((item: any) => {
        return Object.keys(item).reduce((newData: any, key: any) => {
            if (!changeList[key]) {
                return newData;
            }

            const newKey = changeList[key];
            if (key === "sex") {
                newData[newKey] = item[key] ? "女" : "男";
            } else {
                newData[newKey] = item[key];
            }
            return newData;
        }, {});
    });
    const sheet = XLSX.utils.json_to_sheet(data);

    const sheetName = "sheet1";
    const workbook: any = {
        SheetNames: [sheetName],
        Sheets: {},
    };
    workbook.Sheets[sheetName] = sheet;

    const opts: any = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
    };
    const xout = XLSX.write(workbook, opts);
    const blob = new Blob([s2ab(xout)]);
    function s2ab(s: any) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++)
            view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    return blob;
};

export default SheetToBlob;