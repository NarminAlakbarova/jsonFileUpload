import { useState } from "react";

const CustomTable = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex} style={tableCellStyle}>
                {row[column]}
              </td>
            ))}
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
  const [tableColumns, setTableColumns] = useState([]);

  console.log(allValues);
  console.log(jsonData);

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const fileContent = e.target.result;

      try {
        const parsedData = JSON.parse(fileContent);
        setJsonData(parsedData);

        const values = getAllValues(parsedData);
        setAllValues(values);

        const columns = Object.keys(parsedData[0]);
        setTableColumns(columns);
      } catch (error) {
        console.error("Invalid JSON file");
      }
    };
  };

  function getAllValues(obj) {
    let values = [];
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        const nestedValues = getAllValues(obj[key]);
        values = values.concat(nestedValues);
      } else {
        values.push(obj[key]);
      }
    }
    return values;
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {jsonData && (
        <div>
          <h3>All Values:</h3>
          <ul>
            {allValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
