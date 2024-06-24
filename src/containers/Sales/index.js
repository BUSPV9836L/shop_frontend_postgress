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
  const [rowData2, setRowData2] = useState([]);
  const location = useLocation();
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
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
      alert(error.message)
    } finally {
      setLoading(false);
    }
  };
  const getSalesDetails = async (invoice_no) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/sales/saleswithinvoiceno`);
      url.searchParams.append("user_id", sessionStorage.getItem("userid"));
      url.searchParams.append("invoice_no", invoice_no);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setRowData2(data);
      }
    } catch (error) {
      alert(error.message)
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
  const onGridReady2 = (params) => {
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
      {
        headerName: "Inovie No.",
        field: "invoice_no",
        flex: 1,
        cellStyle: {
          color: "var(--main-bg-color)",
          cursor: "pointer",
        },
      },
      { headerName: "Customer Name", field: "customer_name", flex: 1 },
      { headerName: "Customer Phone", field: "phone_no", flex: 1 },
      { headerName: "Total Quantity", field: "total_quantity", flex: 1 },
      { headerName: "Total Amount", field: "total_invoice_amount", flex: 1 },
      {
        headerName: "Print Invoice",
        field: "print_invoice",
        flex: 1,
        cellRenderer: (params) => {
          return (
            <button
              className="btn btn-primary"
              onClick={async () => {
                navigate("/" + String.InvoiceReceipt, {
                  state: {invoice_no:params.data.invoice_no},
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
            autoHeight: true,
          }}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          suppressCellSelection={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          enableCellTextSelection={true}
          domLayout={"autoHeight"}
          onCellClicked={(params) => {
            if (params.colDef.headerName == "Inovie No.") {
              console.log(params.data.invoice_no, "fdsjfjks");
              getSalesDetails(params.data.invoice_no);
            }
          }}
        />
      </div>
    );
  };
  const saleDetailsTable = () => {
    const colDefs = [
      {
        headerName: "Product Name",
        field: "name",
        flex: 1,
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      { headerName: "Quantity", field: "quantity", flex: 1 },
      { headerName: "Total Amount", field: "total_price", flex: 1 },
      {
        headerName: "Purchase Time",
        flex: 1,
        cellRenderer: (param) => {
          return param.data.created_at.split("T")[0];
        },
      },
    ];

    return (
      <div
        className="ag-theme-quartz custom-ag-theme"
        style={{ width: "100%", paddingRight: "20px" }}
      >
        <AgGridReact
          rowData={rowData2}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            width: 100,
            autoHeight: true,
          }}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          suppressCellSelection={true}
          onGridReady={onGridReady2}
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
      {rowData2.length > 0 && saleDetailsTable()}
    </div>
  );
};

export default Sales;
