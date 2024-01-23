import { useState } from "react";

const CustomTable = ({ keyValuePairs }) => {
  if (!keyValuePairs || keyValuePairs.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {keyValuePairs.map(({ key, value }, rowIndex) => (
          <tr key={rowIndex}>
            <td style={tableCellStyle}>{key}</td>
            <td style={tableCellStyle}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [allValues, setAllValues] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState([]);

  console.log(keyValuePairs);

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const fileContent = e.target.result;

      try {
        const parsedData = JSON.parse(fileContent);
        setJsonData(parsedData);

        const pairs = getAllKeyValuePairs(parsedData);
        setKeyValuePairs(pairs);
      } catch (error) {
        console.error("Invalid JSON file");
      }
    };
  };

  function getAllKeyValuePairs(obj, parentKey = "") {
    let pairs = [];
    for (const key in obj) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object") {
        const nestedPairs = getAllKeyValuePairs(obj[key], currentKey);
        pairs = pairs.concat(nestedPairs);
      } else {
        pairs.push({ key: currentKey, value: obj[key] });
      }
    }
    return pairs;
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {jsonData && (
        <div>
          <h3>All Key-Value Pairs:</h3>
          <CustomTable keyValuePairs={keyValuePairs} />
        </div>
      )}
    </div>
  );
};

export default App;
