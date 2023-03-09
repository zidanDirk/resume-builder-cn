const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

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
    
    return response;
};
const fullName = "zidan"
const currentPosition = "软件工程师"
const currentLength = 3
const currentTechnologies = "javascript"
const workArray = [ {
    name: "阿里巴巴",
    position: "前端工程师"
},
{
    name: "腾讯",
    position: "Node.js 工程师"
}, 
{
    name: "百度",
    position: "UI 设计师"
}
]
const remainderText = () => {
    let stringText = "";
    for (let i = 0; i < workArray.length; i++) {
        stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
    }
    return stringText;
};

const txt = "我正在写一份简历，我的名称是zidan，是一名软件工程师，你能帮我用第一人称写 100 字简介么"
const txt2 = `我正在写一份简历, 我的详细信息是 \n 姓名: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我使用的技术是: ${currentTechnologies}. 你能帮我在简历上写 5 个关于我擅长的优点吗？`;
const txt3 = `我正在写一份简历, 我的详细信息是 \n 姓名: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我曾经在 ${
    workArray.length
} 个公司工作过. ${remainderText()} \n 你能为每个公司写 50 字描述吗，用我在公司的号分开（第一人称）?`;

GPTFunction(txt3).then(res => {
    console.log(res.data.choices[0])
})
