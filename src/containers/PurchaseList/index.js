import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation } from "react-router";
import moment from "moment";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY, SUCCESS } from "../../component/Alert";

const PurchaseList = () => {
  const { Alert } = useAlert();
  const [product, setProduct] = useState([
    {
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      supplier_name: ""
    },
  ]);

  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddNewClicked, setIsAddNewClicked] = useState(false);
  const [popupTitle, setPopUpTitle] = useState("");
  const [idFromValid, setIsFromValid] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaveing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [supplier, setSupplier] = useState([])
  const getAllPurchase = async () => {
    try {
      setIsSaveing(true);
      setLoading(true);
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/purchases`);
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
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER, error.message);
    } finally {
      setIsModalOpen(false);
      setIsSaveing(false);
      setLoading(false);
    }
  };
  const getPurchaseWithInvoice = async (invoice_no) => {
    try {
      setIsSaveing(true);
      setLoading(true);
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/purchases/getPurchaseWithInvoice`);
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
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER, error.message);
    } finally {
      setIsModalOpen(false);
      setIsSaveing(false);
      setLoading(false);
    }
  };
  const updatePurchase = async () => {
    setIsSaveing(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/purchases`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product[0].name,
          brand: product[0].brand,
          category: product[0].category,
          price: product[0].price,
          quantity_available: product[0].quantity_available,
          id: product[0].id,
          user_id: sessionStorage.getItem("userid"),
        }),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setProduct([
          {
            id: 0,
            name: "",
            brand: "",
            category: "",
            price: "",
            quantity_available: "",
          },
        ]);
        getAllPurchase();
        setRowData2([])
        Alert(SUCCESS, "Record Updated Succesfully!");
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER, error.message);
    } finally {
      setIsModalOpen(false);
    }
  };
  const getAllSupplier = async () => {
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
        setSupplier(data);
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER, error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllPurchase();
    getAllSupplier()
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
  const PurchaseTable = () => {
    const colDefs = [
      {
        headerName: "Invoice No.",
        field: "puchase_invoice_no",
        flex: 1,
        cellStyle: { color: "var(--main-bg-color)", cursor: "pointer" },
        cellRenderer: (params) => {
          return <span>{params.data.puchase_invoice_no.split("purchase")[1]}</span>
        }
      },
      { headerName: "Total Amount", field: "price", flex: 1 },
      {
        headerName: "Purcahse Date", field: "created_at", flex: 1, cellRenderer: (params) => {
          return <span>{params.data.created_at.split("T")[0]}</span>
        }
      },
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
            autoHeight: true,
          }}
          suppressCellSelection={true}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          rowSelection="multiple"
          pagination={true}
          onGridReady={onGridReady}
          paginationPageSize={10}
          enableCellTextSelection={true}
          domLayout={"autoHeight"}
          onCellClicked={(event) => {
            if (event.colDef.headerName === "Invoice No.") {
              getPurchaseWithInvoice(event?.data?.puchase_invoice_no)
            }
          }}
        />
      </div>
    );
  };
  const PurchaseTableDetails = () => {
    const colDefs = [
      {
        headerName: "Supplier Name",
        field: "supplier_name",
        flex: 1,

      },
      {
        headerName: "Product Name",
        field: "name",
        flex: 1,
        cellStyle: { color: "var(--main-bg-color)", cursor: "pointer" },
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      { headerName: "MRP", field: "price", flex: 1 },
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
          rowData={rowData2}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            width: 100,
            autoHeight: true,
          }}
          suppressCellSelection={true}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          rowSelection="multiple"
          pagination={true}
          onGridReady={onGridReady}
          paginationPageSize={10}
          enableCellTextSelection={true}
          domLayout={"autoHeight"}
          onCellClicked={(event) => {
            if (event.colDef.headerName === "Product Name") {
              setProduct(() => {
                return [
                  {
                    name: event?.data?.name,
                    brand: event?.data?.brand,
                    category: event?.data?.category,
                    price: event?.data?.price,
                    quantity_available: event.data?.quantity_available,
                    id: event?.data?.id,
                    isControldisabled: true,
                  },
                ];
              });
              setIsAddNewClicked(false);
              setIsUpdate(true);
              setPopUpTitle("Update Purchase");
              toggleModal();
            }
          }}
        />
      </div>
    );
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsSaveing(false);
  };

  const addIteamInPurchasePopUp = () => {
    if (!isModalOpen) return null;
    const addIteam = () => {
      return (
        <div className=" card ">
          <div style={{ marginRight: "20px" }} className=" mb-3 text-end">
            <button
              style={{ marginRight: "20px" }}
              className=" btn "
              onClick={updatePurchase}
              disabled={!isUpdate || isSaving}
            >
              Update
            </button>
          </div>
          <div style={{ width: "100%", overflowX: "scroll" }}>
            <table className=" table " style={{ width: "1200px" }}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  ></th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    No.
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Supplier
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    MRP
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {product?.map((event, index) => (
                  <tr key={event?.id}>
                    <td>
                      {index === product.length - 1 && (
                        <span
                          onClick={() => {
                            if (!event.isControldisabled) {
                              handelAddNew();
                            }
                          }}
                          style={{
                            fontSize: "20px",
                            fontWeight: "bolder",
                            cursor: !event.isControldisabled ? "pointer" : "",
                          }}
                          aria-hidden="true"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="var(--main-bg-color)"
                            class="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <select
                        disabled
                        type="text"
                        name="supplier_name"
                        value={product && product[index]?.supplier_name}
                        id="name"
                        className="form-control"
                        onChange={(e) => handelChange(e, event?.id)}
                      >
                        <option value="" selected disabled>Select Supplier</option>
                        {supplier.map(e => {
                          return <option>{e?.supplier_name}</option>
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        disabled
                        type="text"
                        name="name"
                        value={product && product[index]?.name}
                        id="name"
                        className="form-control"
                        onChange={(e) => handelChange(e, event?.id)}
                      />
                    </td>
                    <td>
                      <input
                        disabled
                        type="text"
                        name="brand"
                        value={product && product[index]?.brand}
                        onChange={(e) => handelChange(e, event?.id)}
                        id="brand"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        disabled
                        type="text"
                        name="category"
                        value={product && product[index]?.category}
                        onChange={(e) => handelChange(e, event?.id)}
                        id="category"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        disabled
                        onChange={(e) => {
                          let number = e.target.value;
                          if (isNaN(number) || number < 0) {
                            return;
                          } else if (/^0/.test(number)) {
                            number = number.replace(/^0/, "");
                          } else {
                            handelChange(e, event?.id);
                          }
                        }}
                        type="text"
                        name="price"
                        value={product && product[index]?.price}
                        id="price"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input

                        type="text"
                        value={product && product[index]?.quantity_available}
                        name="quantity_available"
                        id="quantity_available"
                        className="form-control"
                        onChange={(e) => {
                          let number = e.target.value;
                          if (isNaN(number) || number < 0 || number % 1 !== 0) {
                            return;
                          } else {
                            handelChange(e, event?.id);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <span
                        onClick={() => {
                          if (!event.isControldisabled) {
                            handelDelete(event?.id);
                          }
                        }}
                        style={{
                          fontSize: "20px",
                          fontWeight: "bolder",
                          cursor: !event.isControldisabled ? "pointer" : "",
                        }}
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="var(--main-bg-color)"
                          class="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };
    const handelAddNew = () => {
      setIsFromValid(false);
      const insertNew = {
        id: Math.random() * 100,
        name: "",
        brand: "",
        category: "",
        price: "",
        quantity_available: "",
        quantity: "",
        total_price: "",
      };
      setProduct((prev) => {
        return [...prev, insertNew];
      });
    };
    const handelDelete = (id) => {
      if (product.length == 1) return;
      let afterDeletProduct = product?.filter((e) => e?.id !== id);
      setProduct((prev) => {
        return afterDeletProduct;
      });
    };
    const handelChange = (e, id) => {
      const { name, value } = e.target;
      let res = product.map((e) => {
        if (e?.id == id) {
          return {
            ...e,
            [name]: value,
          };
        } else {
          return e;
        }
      });
      checkIsFormValid(name, value);
      setProduct(res);
    };
    const checkIsFormValid = (name, value) => {
      console.log(product);
      product?.map((e) => {
        if (
          (name == "name" ? value : e.name) &&
          (name == "category" ? value : e.category) &&
          (name == "brand" ? value : e.brand) &&
          (name == "price" ? value : e.price) &&
          (name == "quantity_available" ? value : e.quantity_available) &&
          (name == "supplier_name" ? value : e.supplier_name)
        ) {
          setIsFromValid(true);
        } else {
          setIsFromValid(false);
        }
      });
    };
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
                onClick={() => {
                  setIsAddNewClicked(false);
                  toggleModal();
                }}
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
            <div className="modal-body">{addIteam()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 className="heading-text mb-5">Purchase List</h4>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {PurchaseTable()}
      {rowData2?.length > 0 && PurchaseTableDetails()}
      {addIteamInPurchasePopUp()}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default PurchaseList;
