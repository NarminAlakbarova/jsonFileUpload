import React, { useState } from "react";
import { Table } from "antd";

const App = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [columns, setColumns] = useState([]);
  console.log(jsonFile);
  console.log(columns);
  
  function flattenObject(ob, parentKey = "") {
    let toReturn = {};
  
    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
  
      let key = parentKey ? `${parentKey}.${i}` : i;
  
      if (Array.isArray(ob[i])) {
        // Handle arrays by converting each element to a flat object
        ob[i].forEach((item, index) => {
          let arrayKey = `${key}[${index}]`;
          if (typeof item === "object" && item !== null) {
            let flatObject = flattenObject(item, arrayKey);
            toReturn = { ...toReturn, ...flatObject };
          } else {
            toReturn[arrayKey] = item;
          }
        });
      } else if (typeof ob[i] === "object" && ob[i] !== null) {
        // Recursively flatten nested objects
        let flatObject = flattenObject(ob[i], key);
        toReturn = { ...toReturn, ...flatObject };
      } else {
        toReturn[key] = ob[i];
      }
    }
    return toReturn;
  }
  

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      let flattenedData = flattenObject(jsonData);
      let columns = Object.keys(flattenedData).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
      }));

      setJsonFile([flattenedData]);
      setColumns(columns);
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />

      {jsonFile && <Table dataSource={jsonFile} columns={columns} />}
    </div>
  );
};

export default App;
