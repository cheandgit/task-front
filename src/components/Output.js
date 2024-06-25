import axios from "axios";
import { useState } from "react";
import { Box, Button, Text, useToast  } from "@chakra-ui/react";
import { TASKAPI, executeCode, runRoslynator } from "../api";

const Output = ({editorRef, codeId, codeName, codeTxt}) => {
    const toast = useToast();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    // const runSubmit = async (event) => {
    //     // axios.put работал только для локально запущенного back end сервера!
    //     // -----
    //     // [HttpPut]
    //     // [Route("UpdateTaskCode")]
    //     // public async Task<IActionResult> UpdateTaskCode(int id, string newCode) { ... }
    //     // ----- 
    //     var loc = code.replaceAll("+", "_p_");
    //     try {
    //         //"https://localhost:7297/api/Student/UpdateTaskCode?id=1&newCode=using%20System%3B%5Cn" - OK!
    //         const response = await axios.put(`${TASKAPI}UpdateTaskCode?id=${id}&newCode=${JSON.stringify(loc)}`, { 
    //             headers: { 'Content-Type': 'application/json' }});
    //         if (response.status === 200) {
    //             setMessage('Task code updated successfully!');
    //         }
    //     } catch (error) {
    //         setMessage('Failed to update task code!');
    //     }
    // };
    
    const runSubmit = async () => {
        try {
            const response = await axios.patch(`${TASKAPI}UpdateTaskAsync/${codeId}`, {
                id: codeId,
                name: codeName,
                code: codeTxt }, {
                headers: { 'Content-Type': 'application/json'
            }});
            if (response.status === 200) {
                console.log('Code updated successfully:', response.data);
            } else {
                console.error('Failed to update code:', response.statusText);
            } 
        } catch (error) {
            console.error('Error updating code:', error);
        }
    };

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const { run: result } = await executeCode(sourceCode);
            setOutput(result.output.split("\n"));
            result.stderr ? setIsError(true) : setIsError(false);
        } catch (error) {
            console.log(error);
            toast({
              title: "An error occurred.",
              description: error.message || "Unable to run code",
              status: "error",
              duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const runCompile = async () => {
        const name = codeName;
        if (!name) return;
        try {
            setIsLoading(true);
            // const result = await axios.get("https://localhost:7297/api/Student/GetCompileLogAsync/" + name);    
            // setOutput(result.data);
            const result = await axios.get(`${TASKAPI}GetCompileStdAsync/${name}`);
            setOutput(result.data.split("\r\n"));
            result.stderr ? setIsError(true) : setIsError(false);                     
        } catch (error) {
            console.log(error);
        }
    };

    const compileRun = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(`${TASKAPI}CompileAndRun`, {
                sourceCode: codeTxt }, {
                headers: { 'Content-Type': 'application/json' },
            });
            setOutput(result.data.split("\r\n"));
            result.stderr ? setIsError(true) : setIsError(false);                     
        } catch (error) {
            console.log(error);
        }
    };

    const runOutput = async () => {
        const name = codeName;
        if (!name) return;
        try {
            setIsLoading(true);
            const result = await axios.get(`${TASKAPI}GetOutputAsync/${name}`);
            setOutput(result.data.split("\r\n"));
            result.stderr ? setIsError(true) : setIsError(false);                     
        } catch (error) {
            console.log(error);
        }
    };

    const runTesting = async () => {
        const name = codeName;
        if (!name) return;
        try {
            setIsLoading(true);
            const result = await axios.get("https://localhost:7297/api/Student/GetTestingOutput/" + name);
            setOutput(result.data.split("\r\n"));                           
            
        } catch (error) {
            console.log(error);
        }
    };

    const runRoslynator = async () => {
        const name = codeName;
        //const name = "program";  // проверка
        if (!name) return;
        try {
            setIsLoading(true);
            const result = await axios.get("https://localhost:7297/api/Student/GetRoslynatorAsync/" + name);
            setOutput(result.data);                            
            
        } catch (error) {
            console.log(error);
        }
    };

    // async function getOutput(id) {
    //     const headers = {
    //       "Content-Type": "application/json"
    //     };
    //     const result = await axios.get("https://localhost:7297/api/Student/GetOutput/" + id, { headers } );
    //     setOutput(result.data.replaceAll("\\n", "\n").split("\n"));
    // }
      
    return (
        <Box w="50%" mt={5} >
            {/* <Button size='sm' borderWidth='0px' px={10} mb={10} */}
            {/* <Button size='sm' borderWidth='0px' px={10} ml={10} mb={10} */}
            <Button type="button" class="btn btn-primary btn-sm"
                //isLoading={isLoading}
                onClick={runCode}>Run Code</Button>&nbsp;&nbsp;
            <Button type="button" class="btn btn-dark btn-sm"
                //isLoading={isLoading}
                onClick={runSubmit}>Submit</Button>&nbsp;&nbsp;
            {/*<Button type="button" class="btn btn-secondary btn-sm"
                onClick={runCompile}>Compile</Button>&nbsp;&nbsp; */}
            {/* <Button type="button" class="btn btn-success btn-sm"
                onClick={runOutput}>Run</Button>&nbsp;&nbsp; */}
            <Button type="button" class="btn btn-success btn-sm"    
                onClick={compileRun}>Compile Run</Button>&nbsp;&nbsp;
            <Button type="button" class="btn btn-danger btn-sm"
                onClick={runTesting}>Test</Button>&nbsp;&nbsp;
            {/* <Button type="button" class="btn btn-danger btn-sm"
                onClick={runRoslynator}>Run Roslynator</Button> */}
            <Box height="65vh" mr={10} mt={4} bg="#f2f2f2"
                border="1px solid"
                borderColor="#444"  
                color={isError ? "red" : ""}>
                {output ? <Text>{output.map((line) => <span>{line}<br/></span>)}</Text>
                : 'Click "Run Code" to see the output here'}
                {/* {output ? output.map((line, i) => <Text key={i}>{line}</Text>)
                : 'Click "Run Code" to see the output here'}  */}
            </Box>
        </Box>
    )
};
export default Output;
