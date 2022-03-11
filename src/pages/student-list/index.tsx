import { Table, Space, Button } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from '../../assets/styles/student-list/student-list.module.css';
import roles from "../../config/role";

import StudentFilter from "../../components/student-filter";

const StudentList = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(roles.TEACHER);
    const [fileData, setFileData] = useState<StudentListData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedList, setSelectedList] = useState([]);

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.TEACHER;
        setRole(parseInt(userRole));
    }, []);

    useEffect(() => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                student_id: "00000000" + i,
                name: 'John',
                grade: "2018",
                profession: "软件工程",
                sex: "女",
                teacher_name: "行露",
                email: "3428098215@qq.com",
                stage: "毕业设计论文",
            });
        }
        setFileData(data);
        setTotalItems(100);
    }, []);

    const handleChangePage = (page: any, size: any) => {
        console.log(page);
        setPageSize(size);
    };

    const searchSubmitList = (msg: any) => {
        console.log("filterMsg: ", msg);
    };

    const handleClickExport = () => {
        console.log("export");
    };

    const handleClickImport = () => {
        console.log("import");
    };

    const handleClickDelect = () => {
        console.log(selectedList);
    };

    const handleChangeSelect = (selected: any) => {
        setSelectedList(selected);
    };

    const handleClickEdit = (text: any) => {
        const { student_id } = text;
        navigate(`/student-list/edit/${student_id}`);
    };

    const handleClickDetail = (text: any) => {
        const { student_id } = text;
        if (role === roles.ADMIN) {
            navigate(`/student-list/detail/${student_id}`);
        } else {
            navigate(`/student-list/stage-detail/${student_id}`);
        }
    };

    return (
        <div>
            <StudentFilter searchItem={searchSubmitList} />
            <Table
                className={style.table}
                dataSource={fileData}
                rowKey="student_id"
                rowSelection={{
                    type: "checkbox",
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
                <Table.Column title="性别" dataIndex="sex" />
                <Table.Column title="年级" dataIndex="grade" />
                <Table.Column title="专业" dataIndex="profession" />
                {
                    role === roles.ADMIN ?
                        <Table.Column title="指导老师" dataIndex="teacher_name" /> :
                        <>
                            <Table.Column title="毕业设计阶段" dataIndex="stage" width={200} />
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