import axios from "axios";

// export const TASKAPI = axios.create({
//    baseURL: "http://194.87.239.124/api/Student/"
//    //baseURL: "https://192.168.1.131:8085/api/Student/"
//    //baseURL: "https://localhost:7297/api/Student/"  // требуется запуск локального back сервера
//  });

 export const TASKAPI = 
  //"http://194.87.239.124/api/Student/";
  //"http://192.168.1.131:8090/api/Student/";  // работает!
  "https://7af2-94-140-153-169.ngrok-free.app/api/Student/";  // работает!
  //"https://localhost:7297/api/Student/"; // требуется запуск локального back сервера

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
});

export const executeCode = async (sourceCode) => {
    const response = await API.post("/execute", {
      language: "csharp",
      version: "6.12.0", 
      files: [
        {
          content: sourceCode,
          //content: '\nusing System;\npublic class Program\n{\n\tpublic static void Main()\n\t{\n\t\tConsole.WriteLine("Hello, C#!");\n\t}\n}\n'
        },
      ],
    });
    return response.data;
  };
  