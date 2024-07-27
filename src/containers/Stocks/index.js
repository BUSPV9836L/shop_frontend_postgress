import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation } from "react-router";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY } from "../../component/Alert";

const Stocks = () => {
  const {Alert}=useAlert();
  const location = useLocation();
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllStocks = async () => {
    const url = new URL(`${String.BASE_URL}/stocks`);
    url.searchParams.append("user_id", sessionStorage.getItem("userid"));
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setRowData(data);
      }else{
        Alert(PRIMARY,data.message)
      }
    } catch (error) {
      Alert(DANGER,error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [loading, gridApi]);

  const stockTable = () => {
    const colDefs = [
      {
        headerName: "Product Name",
        field: "name",
        flex: 1
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      {
        headerName: "Available Quantity",
        field: "quantity_available",
        flex: 1,
      },
    ];

    return (
      <div
        className="ag-theme-quartz custom-ag-theme"
        style={{ width: "100%", paddingRight: "20px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            width: 100,
          }}
          gridOptions={{
            headerHeight: 30,
            rowHeight: 28,
            autoHeight:true
          }}
          onGridReady={onGridReady}
          suppressCellSelection={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          enableCellTextSelection={true}
          domLayout={"autoHeight"}
        />
      </div>
    );
  };
  return (
    <div>
      <h4 className="heading-text mb-5">Stocks</h4>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {stockTable()}
    </div>
  );
};

export default Stocks;
