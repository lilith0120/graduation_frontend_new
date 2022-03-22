import { Table, Space, Button, message, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileSaver from 'file-saver';
import SheetToBlob from '../../config/sheet-to-blob';
import SheetToJson from '../../config/sheet-to-json';
import style from '../../assets/styles/student-list/student-list.module.css';
import { TeacherLabel, getKey } from '../../config/teacher-label';
import axios from '../../http';

import TeacherFilter from "../../components/teacher-filter";

const TeacherList = () => {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState<TeacherListData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterMsg, setFilterMsg] = useState<any>({});
    const [selectedList, setSelectedList] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    useEffect(() => {
        const ps = sessionStorage.getItem("pageSize");
        const cp = sessionStorage.getItem("currentPage");
        const fm = sessionStorage.getItem("filterMsg");

        if (ps) {
            setPageSize(parseInt(ps));
        }

        if (cp) {
            setCurrentPage(parseInt(cp));
        }

        if (fm) {
            setFilterMsg(JSON.parse(fm));
        }
    }, []);

    useEffect(() => {
        fetchData();

        sessionStorage.setItem("pageSize", pageSize.toString());
        sessionStorage.setItem("currentPage", currentPage.toString());
        sessionStorage.setItem("filterMsg", JSON.stringify(filterMsg));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage, filterMsg]);

    const fetchData = async () => {
        const { user_id, name, sex } = filterMsg;
        const res: any = await axios.post('/api/teacher/all', {
            size: pageSize,
            current: currentPage,
            search: {
                user_id,
                name,
                sex,
            },
        });

        const { totalNum, teachers } = res;
        setTotalItems(totalNum);
        setFileData(teachers);
    };

    const handleChangePage = (page: any, size: any) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const searchSubmitList = (msg: any) => {
        setFilterMsg(msg);
    };

    const handleClickExport = () => {
        if (!selectedList.length) {
            message.warning("未选择导出对象");

            return;
        }

        handleExportData();
        setSelectedList([]);
        setSelectedRow([]);
    };

    const handleClickImport = async (file: any) => {
        const { name } = file;
        const format = name.substr(name.lastIndexOf(".") + 1);
        if (format !== "xlsx" && format !== "xls") {
            message.warning("文件格式只能为Excel");

            return false;
        }

        const importData = await SheetToJson(file, getKey);
        await handleImportData(importData);

        return false;
    };

    const handleChangeSelect = (selected: any, selectedRow: any) => {
        setSelectedList(selected);
        setSelectedRow(selectedRow);
    };

    const handleClickEdit = (text: any) => {
        const { id } = text;
        navigate(`/teacher-list/edit/${id}`);
    };

    const handleClickDetail = (text: any) => {
        const { id } = text;
        navigate(`/teacher-list/detail/${id}`);
    };

    const handleExportData = () => {
        const blob = SheetToBlob(selectedRow, TeacherLabel);
        FileSaver.saveAs(blob, "指导教师列表.xlsx");
    };

    const handleImportData = async (importData: any) => {
        const res = await axios.post('/api/admin/add_teacher', {
            teachers: importData,
        });

        if (!res) {
            message.error("批量导入失败");

            return;
        }
        message.success("批量导入成功");
        setFileData([...fileData, ...importData]);
        setTotalItems(totalItems + importData.length);
    };

    return (
        <div>
            <TeacherFilter searchItem={searchSubmitList} filterMsg={filterMsg} />
            <Table
                className={style.table}
                dataSource={fileData}
                rowKey="id"
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedList,
                    onChange: handleChangeSelect
                }}
                title={() => (
                    <div className={style.create_btn}>
                        <Space>
                            <Upload
                                accept=".xls,.xlsx,application/vnd.ms-excel"
                                maxCount={1}
                                beforeUpload={handleClickImport}
                                fileList={[]}>
                                <Button type="primary">批量导入</Button>
                            </Upload>
                            <Button type="primary" onClick={handleClickExport}>批量导出</Button>
                        </Space>
                    </div>
                )}
                pagination={
                    {
                        total: totalItems,
                        pageSize,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 条`,
                        onChange: handleChangePage,
                    }
                }
                scroll={{ y: 330 }}>
                <Table.Column title="教职工号" dataIndex="teacher_id" />
                <Table.Column title="教师名字" dataIndex="name" />
                <Table.Column title="性别" dataIndex="sex"
                    render={(text) => {
                        return text ? "女" : "男";
                    }} />
                <Table.Column title="邮箱" dataIndex="email" />
                <Table.Column
                    title="操作"
                    render={(text) => (
                        <Space size="middle">
                            <Button type="primary" size="small"
                                onClick={() => handleClickDetail(text)}>
                                查看
                            </Button>
                            <Button type="primary" size="small" ghost
                                onClick={() => handleClickEdit(text)}>
                                编辑
                            </Button>
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
};
export default TeacherList;