import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY } from "../../component/Alert";

const Supplier = () => {
  const { Alert } = useAlert();
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupTitle, setPopUpTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplier, setSupplier] = useState({
    supplier_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address_line1: '',
    city: '',
    state: '',
    user_id: 1
  });

  const getAllSupplier = async () => {
    setLoading(true)
    const url = new URL(`${String.BASE_URL}/suppliers`);
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
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSupplier();
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

  const supplierTable = () => {
    const colDefs = [
      {
        headerName: "Supplier Name",
        field: "supplier_name",
        flex: 1,
      },
      {
        headerName: "Contact Name",
        field: "contact_name",
        flex: 1,
      },
      {
        headerName: "Contact Phone",
        field: "contact_phone",
        flex: 1,
      },
      {
        headerName: "Contact Address",
        field: "address_line1",
        flex: 1,
        cellRenderer: (params) => {
          return `${params?.data?.address_line1}, ${params?.data?.city}, ${params?.data?.state}`;
        },
      },
      {
        headerName: "Contact Date",
        field: "created_at",
        flex: 1,
        cellRenderer: (params) => {
          return params?.data?.created_at.split("T")[0];
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
          }}
          gridOptions={{
            headerHeight: 30,
            rowHeight: 28,
            autoHeight: true,
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    if (!supplier.supplier_name) {
      Alert(DANGER, "Please Enter Supplier Name")
      return false
    } else if (!supplier.contact_name) {
      Alert(DANGER, "Please Enter Supplier")
      return false
    } else if (!supplier.contact_email) {
      Alert(DANGER, "Please Enter Contact Email")
      return false
    } else if (supplier.contact_phone?.trim().length !== 10) {
      Alert(DANGER, "Please Enter  Contact Phone")
      return false
    } else if (!supplier.address_line1) {
      Alert(DANGER, "Please Enter Address")
      return false
    } else if (!supplier.city) {
      Alert(DANGER, "Please Enter City")
      return false
    } else if (!supplier.state) {
      Alert(DANGER, "Please Enter State")
      return false
    } else {
      return true
    }
  }
  const handleSubmit = async (e) => {
    if (!validate()) {
      return
    }
    setLoading(true)
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...supplier, user_id: sessionStorage.getItem("userid") }),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        Alert(PRIMARY, "Supplier added successfully");
        getAllSupplier();
        toggleModal();
      } else {
        Alert(DANGER, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setLoading(false)
    }
  };

  const supplierForm = () => {
    return (
      <div className="card">
        <div className="row justify-content-end">
          <button type="button" style={{ width: "fit-content", marginRight: "20px" }} onClick={handleSubmit} className="btn button">Save Supplier</button>
        </div>
        <div className="row">
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="supplier_name">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              id="supplier_name"
              name="supplier_name"
              value={supplier.supplier_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="contact_name">Contact Name</label>
            <input
              type="text"
              className="form-control"
              id="contact_name"
              name="contact_name"
              value={supplier.contact_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="contact_email">Contact Email</label>
            <input
              type="email"
              className="form-control"
              id="contact_email"
              name="contact_email"
              value={supplier.contact_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="contact_phone">Contact Phone</label>
            <input
              type="text"
              className="form-control"
              id="contact_phone"
              name="contact_phone"
              value={supplier.contact_phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="address_line1">Address</label>
            <input
              type="text"
              className="form-control"
              id="address_line1"
              name="address_line1"
              value={supplier.address_line1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="city">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={supplier.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-2 col-md-4">
            <label htmlFor="state">State</label>
            <input
              type="text"
              className="form-control"
              id="state"
              name="state"
              value={supplier.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    )
  }
  const addSupplier = () => {
    if (!isModalOpen) return null;
    return (
      <div
        className="modal fade show d-block"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {popupTitle}
              </h5>
              <button
                type="button"
                className="close"
                onClick={toggleModal}
                aria-label="Close"
              >
                <span
                  style={{ fontSize: "20px", fontWeight: "bolder" }}
                  aria-hidden="true"
                >
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body p-3">
              {supplierForm()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <h4 className="heading-text mb-5">Supplier List</h4>
      <div style={{ marginRight: "20px", marginTop: "-30px" }} className="mb-3 text-end">
        <button
          className="btn"
          onClick={() => {
            setPopUpTitle("Create Supplier");
            toggleModal();
          }}
        >
          Add New
        </button>
      </div>
      {supplierTable()}
      {addSupplier()}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Supplier;
