import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useState } from "react";
import String from "../../string";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";

const Sales = (props) => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const getAllSales = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/sales`);
      url.searchParams.append(
        "startdate",
        location?.state?.startDate
          ? moment(location?.state?.startDate).format("DD/MM/YYYY")
          : ""
      );
      url.searchParams.append(
        "enddate",
        location?.state?.endDate
          ? moment(location?.state?.endDate).format("DD/MM/YYYY")
          : ""
      );
      url.searchParams.append("user_id", sessionStorage.getItem("userid"));
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
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllSales();
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
  const salesTable = () => {
    const colDefs = [
      { headerName: "Product Name", field: "name", flex: 1 },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      { headerName: "MRP", field: "mrp", flex: 1 },
      { headerName: "Sale Rate", field: "price", flex: 1 },
      { headerName: "Quantity", field: "quantity", flex: 1 },
      { headerName: "Total", field: "total_price", flex: 1 },
      { headerName: "Purchase Date", field: "created_at", flex: 1 },
      {
        headerName: "Print Invoice",
        field: "print_invoice",
        flex: 1,
        cellRenderer: (params) => {
          return (
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/" + String.InvoiceReceipt, {
                  state: [params.data],
                });
              }}
            >
              Print
            </button>
          );
        },
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
            autoHeight:true
          }}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          suppressCellSelection={true}
          onGridReady={onGridReady}
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
      <h4 className="heading-text mb-5">Sales</h4>
      {salesTable()}
    </div>
  );
};

export default Sales;
