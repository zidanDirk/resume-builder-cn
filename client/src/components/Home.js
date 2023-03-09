import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const Home = ({ setResult }) => {
    const [fullName, setFullName] = useState("");
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentLength, setCurrentLength] = useState(1);
    const [currentTechnologies, setCurrentTechnologies] = useState("");
    const [headshot, setHeadshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState([{ name: "", position: "" }]);
    const navigate = useNavigate();

    //👇🏻 更新公司信息
    const handleAddCompany = () => setCompanyInfo([...companyInfo, { name: "", position: "" }]);

    //👇🏻 从公司列表中删除一项
    const handleRemoveCompany = (index) => {
        const list = [...companyInfo];
        list.splice(index, 1);
        setCompanyInfo(list);
    };
    //👇🏻 更新公司列表
    const handleUpdateCompany = (e, index) => {
        const { name, value } = e.target;
        const list = [...companyInfo];
        list[index][name] = value;
        setCompanyInfo(list);
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("headshotImage", headshot, headshot.name);
        formData.append("fullName", fullName);
        formData.append("currentPosition", currentPosition);
        formData.append("currentLength", currentLength);
        formData.append("currentTechnologies", currentTechnologies);
        formData.append("workHistory", JSON.stringify(companyInfo));
        axios
            .post("http://localhost:4000/resume/create", formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data.data)
                    navigate("/resume");
                }
            })
            .catch((err) => console.error(err));
            setLoading(true);
    };
    //👇🏻 渲染 Loading
    if (loading) {
        return <Loading />;
    }
    return (
        <div className='app'>
            <h1>简历生成器</h1>
            <p> 使用 ChatGPT 生成简历 </p>
            <form
                onSubmit={handleFormSubmit}
                method='POST'
                encType='multipart/form-data'
            >
                <label htmlFor='fullName'>输入你的全名</label>
                <input
                    type='text'
                    required
                    name='fullName'
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <div className='nestedContainer'>
                    <div>
                        <label htmlFor='currentPosition'>职称</label>
                        <input
                            type='text'
                            required
                            name='currentPosition'
                            className='currentInput'
                            value={currentPosition}
                            onChange={(e) => setCurrentPosition(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='currentLength'>工作年限</label>
                        <input
                            type='number'
                            required
                            name='currentLength'
                            className='currentInput'
                            value={currentLength}
                            onChange={(e) => setCurrentLength(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='currentTechnologies'>使用的技术栈</label>
                        <input
                            type='text'
                            required
                            name='currentTechnologies'
                            className='currentInput'
                            value={currentTechnologies}
                            onChange={(e) => setCurrentTechnologies(e.target.value)}
                        />
                    </div>
                </div>
                <label htmlFor='photo'>上传你的照片</label>
                <input
                    type='file'
                    name='photo'
                    required
                    id='photo'
                    accept='image/x-png,image/jpeg'
                    onChange={(e) => setHeadshot(e.target.files[0])}
                />

            {companyInfo.map((company, index) => (
                <div className='nestedContainer' key={index}>
                    <div className='companies'>
                        <label htmlFor='name'>公司名称</label>
                        <input
                            type='text'
                            name='name'
                            required
                            onChange={(e) => handleUpdateCompany(e, index)}
                        />
                    </div>
                    <div className='companies'>
                        <label htmlFor='position'>职位</label>
                        <input
                            type='text'
                            name='position'
                            required
                            onChange={(e) => handleUpdateCompany(e, index)}
                        />
                    </div>

                    <div className='btn__group'>
                        {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                            <button id='addBtn' onClick={handleAddCompany}>
                                新增
                            </button>
                        )}
                        {companyInfo.length > 1 && (
                            <button id='deleteBtn' onClick={() => handleRemoveCompany(index)}>
                                删除
                            </button>
                        )}
                    </div>
                </div>
            ))}
                <button>创建简历</button>
            </form>
        </div>
    );
};

export default Home;