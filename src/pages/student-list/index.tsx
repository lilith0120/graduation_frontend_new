import { Table, Space, Button, message } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from '../../assets/styles/student-list/student-list.module.css';
import roles from "../../config/role";
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
        if (role === roles.ADMIN) {
            fetchDataByAdmin();
        } else if (role === roles.TEACHER) {
            fetchDataByTeacher();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage, filterMsg, role]);

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
        console.log(selectedList);
        setSelectedList([]);
    };

    const handleClickImport = () => {
        console.log("import");
    };

    const handleClickDelect = () => {
        if (!selectedList.length) {
            message.warning("未选择导出对象");

            return;
        }
        console.log(selectedList);
        setSelectedList([]);
    };

    const handleChangeSelect = (selected: any) => {
        setSelectedList(selected);
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

    return (
        <div>
            <StudentFilter searchItem={searchSubmitList} />
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
                                    <Button type="primary" onClick={handleClickImport}>批量导入</Button>
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
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 条`,
                        onChange: handleChangePage,
                    }
                }
                scroll={{ y: 280 }}>
                <Table.Column title="学号" dataIndex="student_id" />
                <Table.Column title="学生名字" dataIndex="name" />
                <Table.Column title="性别" dataIndex="sex"
                    render={(text) => {
                        return text ? "女" : "男";
                    }} />
                <Table.Column title="年级" dataIndex="grade" />
                <Table.Column title="专业" dataIndex="profession_name" />
                {
                    role === roles.ADMIN ?
                        <Table.Column title="指导老师" dataIndex="teacher_name" /> :
                        <>
                            <Table.Column title="毕业设计阶段" dataIndex="stage_name" width={200} />
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