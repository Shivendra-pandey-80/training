export class UploadAndFetch {
  constructor(sheet) {
    this.sheet = sheet;
    console.log(this.sheet)
    console.log(this.sheet.sparsematrix);
    
    this.data = null;
  }

  showTableCreationPopup(columns, tempFilePath) {
    console.log("hello");
    const popup = document.createElement("div");
    popup.className = "popup";

    const form = document.createElement("form");
    form.innerHTML = `
            <h2>Create Table</h2>
            <label for="tableName">Table Name:</label>
            <input type="text" id="tableName" required>
            <table>
                <thead>
                    <tr>
                        <th>Column Name</th>
                        <th>Type</th>
                        <th>Allow Null</th>
                        <th>Primary Key</th>
                    </tr>
                </thead>
                <tbody>
                    ${columns
                      .map(
                        (column, index) => `
                        <tr>
                            <td>${column}</td>
                            <td>
                                <select name="type_${index}" required>
                                    <option value="VARCHAR(255)">VARCHAR(255)</option>
                                    <option value="BIGINT">BIGINT</option>
                                    <option value="INT">INT</option>
                                    <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                                </select>
                            </td>
                            <td>
                                <input type="checkbox" name="null_${index}" checked>
                            </td>
                            <td>
                                <input type="radio" name="primary_key" value="${index}">
                            </td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            <button type="submit">Create Table and Upload Data</button>
        `;

    popup.appendChild(form);
    document.body.appendChild(popup);

    form.addEventListener("submit", (e) =>
      this.handleTableCreation(e, columns, tempFilePath, popup)
    );
  }



  async handleTableCreation(e, columns, tempFilePath, popup) {
    e.preventDefault();

    const tableName = document.getElementById("tableName").value;
    const columnDefinitions = columns.map((column, index) => ({
      name: column,
      type: document.querySelector(`[name="type_${index}"]`).value,
      allowNull: document.querySelector(`[name="null_${index}"]`).checked,
      isPrimaryKey:
        document.querySelector(`[name="primary_key"]:checked`)?.value == index,
    }));

    const response = await fetch(
      "http://localhost:5228/api/Data/createTableAndUpload1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName,
          columns: columnDefinitions,
          tempFilePath,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      this.data = data;
      console.log(data);
      alert("Table created and data upload started");
      popup.remove();
      this.checkMiscellaneousRows(tableName);

      for (let i = 1; i <= this.data.length; i++) {
        let j = 1;

        Object.keys(this.data[i-1]).forEach((key) => {
          this.sheet.sparsematrix.setCell(i, j, this.data[i][key]);
          console.log(i,j,this.data[i][key])
          j++;
        });
      }

      this.sheet.sheetRenderer.draw();


    //   for (let i = 0; i < this.data.length; i++) {
    //     for (let j = 0; j < this.data[i].length; j++) {
    //       const targetRow = i;
    //       const targetCol = j;
    //       const value = pastedData[i][j] !== undefined ? pastedData[i][j] : ""; // Ensure value is never undefined
    //       console.log(targetRow, targetCol, value);
    //     }
    //   }
      console.log("end");
    } else {
      alert("Error creating table and uploading data");
    }
  }

  async checkMiscellaneousRows(tableName) {
    try {
      const response = await fetch("http://localhost:5228/api/Data/cmr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.hasMiscellaneousRows) {
        this.showMiscellaneousRowsPopup(tableName);
      } else {
        alert("Data upload completed successfully");
      }
    } catch (error) {
      console.error("Error checking for miscellaneous rows:", error);
      alert("Error checking for miscellaneous rows");
    }
  }

  showMiscellaneousRowsPopup(tableName) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const form = document.createElement("form");
    form.innerHTML = `
            <h2>Miscellaneous Rows Detected</h2>
            <p>Some rows have more columns than expected. How would you like to handle them?</p>
            <select id="miscAction">
                <option value="delete">Delete these rows</option>
                <option value="alterTable">Alter table to add new columns</option>
                <option value="truncate">Add only up to specified columns</option>
            </select>
            <div id="newColumnsDiv" style="display:none;">
                <label for="newColumns">New Column Names (comma-separated):</label>
                <input type="text" id="newColumns">
            </div>
            <div id="columnCountDiv" style="display:none;">
                <label for="columnCount">Number of columns to keep:</label>
                <input type="number" id="columnCount">
            </div>
            <button type="submit">Process Miscellaneous Rows</button>
        `;

    popup.appendChild(form);
    document.body.appendChild(popup);

    const actionSelect = document.getElementById("miscAction");
    const newColumnsDiv = document.getElementById("newColumnsDiv");
    const columnCountDiv = document.getElementById("columnCountDiv");

    actionSelect.addEventListener("change", () => {
      newColumnsDiv.style.display =
        actionSelect.value === "alterTable" ? "block" : "none";
      columnCountDiv.style.display =
        actionSelect.value === "truncate" ? "block" : "none";
    });

    form.addEventListener("submit", (e) =>
      this.handleMiscellaneousRows(
        e,
        actionSelect,
        newColumnsDiv,
        columnCountDiv,
        tableName,
        popup
      )
    );
  }

  async handleMiscellaneousRows(
    e,
    actionSelect,
    newColumnsDiv,
    columnCountDiv,
    tableName,
    popup
  ) {
    e.preventDefault();

    const action = actionSelect.value;
    const newColumns =
      newColumnsDiv.style.display === "block"
        ? document
            .getElementById("newColumns")
            .value.split(",")
            .map((c) => c.trim())
        : [];
    const columnCount =
      columnCountDiv.style.display === "block"
        ? parseInt(document.getElementById("columnCount").value)
        : null;

    try {
      const response = await fetch(
        "http://localhost:5228/api/Data/handleMiscellaneousRows",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            tableName,
            newColumns,
            columnCount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Miscellaneous rows processed successfully");
      popup.remove();
    } catch (error) {
      console.error("Error processing miscellaneous rows:", error);
      alert("Error processing miscellaneous rows");
    }
  }
}
