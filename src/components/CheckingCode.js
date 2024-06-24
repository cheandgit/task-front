import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import Output from "./Output";
import { TASKAPI } from "../api";

// import { CustomTheme } from "./CustomTheme";
// Пока не работает!
// Unfortunately, the docs aren't very clear about this, 
// but you can't simply add your custom theme in the <Editor /> component itself, after you've defined it.
// You need to call two different functions from the Monaco instance. 
// 1.The first is monaco.editor.defineTheme(), in handleEditorDidMount. 
// 2.The second is monaco.editor.setTheme() in handleEditorDidMount.
// https://microsoft.github.io/monaco-editor/playground.html?source=v0.49.0#example-customizing-the-appearence-exposed-colors
// https://www.npmjs.com/package/monaco-themes

function CheckingCode() {
  const [id, setId] = useState("");
  const [task, setName] = useState("");
  const [code, setCode] = useState("");
  const [tasks, setTasks] = useState([]);
  const editorRef = useRef();

  useEffect(() => {
    (async () => await Load())();
  }, []);
 
  async function Load() {
    const headers = {
      "accept": "text/plain", "ngrok-skip-browser-warning": "true"
    };
    //const result = await axios.get("https://localhost:7297/api/Student/GetTasks", { headers } );
    const result = await axios.get(TASKAPI + "GetTasks",  { headers } );
    setTasks(result.data);       
  }
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
};
 
  async function getTaskCode(id, name) {
    const headers = {
      "ngrok-skip-browser-warning": "true"
    };
    const result  = await axios.get(TASKAPI + `GetCode/${id}`, { headers } );

    //setCode('using System;\npublic class Program\n{\n\tpublic static void Main()\n\t{\n\t\tConsole.WriteLine("Hello, C#!");\n\t}\n}\n');  // проверка
    // версии, когда для сохранения кода использовал axios.put(`${TASKAPI}UpdateTaskCode?id=${id}&newCode=${JSON.stringify(loc)}
    //var loc = result.data.replaceAll("\\n", "\n").replaceAll("\\t", "\t").replaceAll("_p_", "+");  // первоначально
    //setCode(loc.split("\\n")[1]);  // проверка
    //var loc = result.data.replaceAll("_p_", "+");  // последний вариант
    //setCode(loc);
    
    setCode(result.data);
    setName(name);
    setId(id);
    
      // if (response.status === 200) {
      //   const result = response.data;
      //   setCode(result);
      //   setName(name);
      //   setId(id);
      // } else {
      //   console.error('Failed to load code:', response.statusText);
      // }
    }
    
  async function editTask(val) {
    setName(val.codeName);
    setCode(val);
    setId(val.id);
  }

    return (
      <Box >
      <h3 align="center">Tasks and Code Compilation</h3>
      <VStack spacing={2}>
      <Box w="25%" alignSelf="self-start" ml="5.5%" >
      <table class="table table-striped">
        <thead>
          <tr class="table-secondary">
            <th scope="col">Task Id</th>
            <th scope="col">Task Name</th>
            <th scope="col">Option</th>
          </tr>
        </thead>
        {tasks.map(function fn(task) {
          return (
            <tbody>
              <tr>
                <td>{task.id} </td>
                <td>{task.name}</td>
                <td>
                  <button type="button" class="btn btn-info btn-sm" 
                    onClick={() => getTaskCode(task.id, task.name)}>Program Code</button>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      </Box>
      <Box border="0px solid" borderColor="blue" w="90%">
        <HStack spacing={10}>
          <Box ml={10} w="50%">
          <Text><b>{task}&nbsp;</b></Text>
            <Box border="1px solid" height="65vh">
            <Editor 
            theme="vs-dark"
            language="csharp"
            defaultValue="//"
            value={code}
            onMount={onMount}
            //options={{ lineNumbers: false, }}
            onChange={(val) => setCode(val)}
            />
          </Box>
          </Box>
          {/* <Output editorRef={editorRef} codeName={task}/> */}
          <Output editorRef={editorRef} codeId={id} codeName={task} codeTxt={code}/>
        </HStack>
      </Box>
      </VStack>
      </Box>
    );
  }
  
  export default CheckingCode;
