const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "",
});

const openai = new OpenAIApi(configuration);

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const GPTFunction = async (text) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.6,
        max_tokens: 1250,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    });
    return response.data.choices[0].text;
};

app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});



app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

let database = [];

app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory,
    } = req.body;


    const workArray = JSON.parse(workHistory);

    const newEntry = {
        id: +new Date,
        fullName,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory: workArray,
    };
    
    const remainderText = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++) {
            stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
        }
        return stringText;
    };

    //👇🏻 工作内容描述
    const prompt1 = `我正在写一份简历, 我的详细信息是 \n 姓名: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我使用的技术是: ${currentTechnologies}. 你能帮我用第一人称的视角写一个简历顶部的 100 字描述吗？`;
    //👇🏻 工作职责描述
    const prompt2 = `我正在写一份简历, 我的详细信息是 \n 姓名: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我使用的技术是: ${currentTechnologies}. 你能帮我在简历上写 5 个关于我擅长的优点吗？`;
    //👇🏻 工作成就描述
    const prompt3 = `我正在写一份简历, 我的详细信息是 \n 姓名: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我曾经在 ${
        workArray.length
    } 个公司工作过. ${remainderText()} \n 你能为每个公司写 50 字描述吗，用我在公司的号分开（第一人称）?`;

    //👇🏻 生成一个 GPT-3 结果
    const objective = await GPTFunction(prompt1);
    const keypoints = await GPTFunction(prompt2);
    const jobResponsibilities = await GPTFunction(prompt3);
    
    const chatgptData = { objective, keypoints, jobResponsibilities };
    
    console.log(chatgptData);

    const data = { ...newEntry, ...chatgptData };
    database.push(data);

    res.json({
        message: "Request successful!",
        data,
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});