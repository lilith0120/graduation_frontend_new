import { Table, Space, Button, message, Upload } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileSaver from 'file-saver';
import SheetToBlob from '../../config/sheet-to-blob';
import SheetToJson from '../../config/sheet-to-json';
import style from '../../assets/styles/student-list/student-list.module.css';
import roles from "../../config/role";
import { StudentLabel, getKey } from '../../config/student-label';
import axios from '../../http';

import StudentFilter from "../../components/student-filter";

const StudentList = () => {
    const navigate = useNavigate();
    const userType = localStorage.getItem("role") ?? roles.TEACHER.toString();
    const role = parseInt(userType);
    const [fileData, setFileData] = useState<StudentListData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterMsg, setFilterMsg] = useState<any>({});
    const [selectedList, setSelectedList] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [professionList, setProfessionList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [isChange, setIsChange] = useState(false);

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

        getProfessionList();
        getTeacherList();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterMsg]);

    useEffect(() => {
        if (role === roles.ADMIN) {
            fetchDataByAdmin();
        } else if (role === roles.TEACHER) {
            fetchDataByTeacher();
        }

        sessionStorage.setItem("pageSize", pageSize.toString());
        sessionStorage.setItem("currentPage", currentPage.toString());
        sessionStorage.setItem("filterMsg", JSON.stringify(filterMsg));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage, role]);

    useEffect(() => {
        if (isChange) {
            if (role === roles.ADMIN) {
                fetchDataByAdmin();
            } else if (role === roles.TEACHER) {
                fetchDataByTeacher();
            }
        }

        setIsChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChange]);

    const fetchDataByAdmin = async () => {
        const { student_id, name, grade, sex, profession_id, teacher_id } = filterMsg;
        const res: any = await axios.post('/api/student/all', {
            size: pageSize,
            current: currentPage,
            search: {
                student_id,
                name,
                grade,
                sex,
                profession_id,
                teacher_id,
            },
        });

        const { totalNum, students } = res;
        setTotalItems(totalNum);
        setFileData(students);
    };

    const fetchDataByTeacher = async () => {
        const { student_id, name, grade, sex, stage_id } = filterMsg;
        const res: any = await axios.post('/api/teacher/all_student', {
            size: pageSize,
            current: currentPage,
            search: {
                student_id,
                name,
                grade,
                sex,
                stage_id,
            },
        });

        const { totalNum, students } = res;
        setTotalItems(totalNum);
        setFileData(students);
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

        const data: any = await SheetToJson(file, getKey);
        const importData = data.map((item: any) => {
            if (item.profession_name) {
                const p: any = professionList.find((p: any) => p.name === item.profession_name);
                item.profession_id = p.id;
                delete item.profession_name;
            }

            if (item.teacher_name) {
                const t: any = teacherList.find((t: any) => t.name === item.teacher_name);
                item.teacher_id = t.id;
                delete item.teacher_name;
            }

            return item;
        });
        await handleImportData(importData);

        return false;
    };

    const handleClickDelect = async () => {
        if (!selectedList.length) {
            message.warning("未选择导出对象");

            return;
        }

        await handleDeleteData();
        setSelectedList([]);
        setSelectedRow([]);
    };

    const handleChangeSelect = (selected: any, selectedRow: any) => {
        setSelectedList(selected);
        setSelectedRow(selectedRow);
    };

    const handleClickEdit = (text: any) => {
        const { id } = text;
        navigate(`/student-list/edit/${id}`);
    };

    const handleClickDetail = (text: any) => {
        const { id } = text;
        if (role === roles.ADMIN) {
            navigate(`/student-list/detail/${id}`);
        } else {
            navigate(`/student-list/stage-detail/${id}`);
        }
    };

    const handleExportData = () => {
        const blob = SheetToBlob(selectedRow, StudentLabel);
        FileSaver.saveAs(blob, "学生列表.xlsx");
    };

    const handleImportData = async (importData: any) => {
        const res = await axios.post('/api/admin/add_student', {
            students: importData,
        });

        if (!res) {
            message.error("批量导入失败");

            return;
        }
        message.success("批量导入成功");
        setIsChange(true);
    };

    const handleDeleteData = async () => {
        const res = await axios.delete('/api/admin/delete_student', {
            data: {
                students: selectedRow,
            },
        });

        if (!res) {
            message.error("批量删除失败");

            return;
        }
        message.success("批量删除成功");
        setIsChange(true);
    };

    const getProfessionList = async () => {
        const res: any = await axios.get('/api/util/get_profession');
        const { professions } = res;
        setProfessionList(professions);
    };

    const getTeacherList = async () => {
        const res: any = await axios.get('/api/util/get_teacher');
        const { teachers } = res;
        setTeacherList(teachers);
    };

    return (
        <div>
            <StudentFilter searchItem={searchSubmitList} filterMsg={filterMsg} />
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
                            {
                                role === roles.ADMIN &&
                                <>
                                    <Button onClick={handleClickDelect}>批量删除</Button>
                                    <Upload
                                        accept=".xls,.xlsx,application/vnd.ms-excel"
                                        maxCount={1}
                                        beforeUpload={handleClickImport}
                                        fileList={[]}>
                                        <Button type="primary">批量导入</Button>
                                    </Upload>
                                </>
                            }
                            <Button type="primary" onClick={handleClickExport}>批量导出</Button>
                        </Space>
                    </div>
                )}
                pagination={
                    {
                        total: totalItems,
                        pageSize,
                        current: currentPage,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 条`,
                        onChange: handleChangePage,
                    }
                }
                scroll={{ y: 280 }}>
                <Table.Column title="学号" dataIndex="student_id" />
                <Table.Column title="学生名字" dataIndex="name" />
                <Table.Column title="性别" dataIndex="sex" width={80}
                    render={(text) => {
                        return text ? "女" : "男";
                    }} />
                <Table.Column title="年级" dataIndex="grade" width={80} />
                <Table.Column title="专业" dataIndex="profession_name" />
                {
                    role === roles.ADMIN ?
                        <Table.Column title="指导老师" dataIndex="teacher_name" /> :
                        <>
                            <Table.Column title="毕业设计阶段" dataIndex="stage_name" width={160} />
                            <Table.Column title="邮箱" dataIndex="email" width={200} />
                        </>
                }
                <Table.Column
                    title="操作"
                    render={(text) => (
                        <Space size="middle">
                            <Button type="primary" size="small"
                                onClick={() => handleClickDetail(text)}>
                                查看
                            </Button>
                            {
                                role === roles.ADMIN &&
                                <Button type="primary" size="small" ghost
                                    onClick={() => handleClickEdit(text)}>
                                    编辑
                                </Button>
                            }
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
};
export default StudentList;