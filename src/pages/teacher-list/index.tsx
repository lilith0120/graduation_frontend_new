import { Table, Space, Button } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from '../../assets/styles/student-list/student-list.module.css';

import TeacherFilter from "../../components/teacher-filter";

const TeacherList = () => {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState<TeacherListData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedList, setSelectedList] = useState([]);

    useEffect(() => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                teacher_id: "00000000" + i,
                name: 'John',
                sex: "女",
                email: "3428098215@qq.com",
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
        console.log(selectedList);
    };

    const handleClickImport = () => {
        console.log("import");
    };

    const handleChangeSelect = (selected: any) => {
        setSelectedList(selected);
    };

    const handleClickEdit = (text: any) => {
        const { teacher_id } = text;
        navigate(`/teacher-list/edit/${teacher_id}`);
    };

    const handleClickDetail = (text: any) => {
        const { teacher_id } = text;
        navigate(`/teacher-list/detail/${teacher_id}`);
    };

    return (
        <div>
            <TeacherFilter searchItem={searchSubmitList} />
            <Table
                className={style.table}
                dataSource={fileData}
                rowKey="teacher_id"
                rowSelection={{
                    type: "checkbox",
                    onChange: handleChangeSelect
                }}
                title={() => (
                    <div className={style.create_btn}>
                        <Space>
                            <Button type="primary" onClick={handleClickImport}>批量导入</Button>
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
                <Table.Column title="性别" dataIndex="sex" />
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