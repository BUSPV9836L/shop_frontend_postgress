import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation } from "react-router";
import moment from "moment";

const Purchase = () => {
  const [product, setProduct] = useState([
    {
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
    },
  ]);
  const [rowData, setRowData] = useState([]);

  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddNewClicked, setIsAddNewClicked] = useState(false);
  const [popupTitle, setPopUpTitle] = useState("");
  const [idFromValid, setIsFromValid] = useState(false);

  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaveing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

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
        alert(data.message);
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setIsModalOpen(false);
      setIsSaveing(false);
      setLoading(false);
    }
  };
  const createPurchase = async () => {
    let json = product.map((e) => {
      return {
        name: e.name,
        brand: e.brand,
        category: e.category,
        price: e.price,
        quantity_available: e.quantity_available,
        user_id: sessionStorage.getItem("userid"),
      };
    });
    setIsSaveing(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(json),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        alert("Record Saved Succesfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server Error");
    } finally {
      setIsModalOpen(false);
      setIsSaveing(false);
      setIsModalOpen(false);
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
      setIsAddNewClicked(false);
      getAllPurchase();
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
        alert("Record Updated Succesfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalOpen(false);
    }
  };
  useEffect(() => {
    getAllPurchase();
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
        headerName: "Product Name",
        field: "name",
        flex: 1,
        cellStyle: { color: "var(--main-bg-color)", cursor: "pointer" },
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      { headerName: "MRP", field: "price", flex: 1 },
      { headerName: "Purcahse Date", field: "created_at", flex: 1 },
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
            autoHeight:true
          }}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          suppressCellSelection={true}
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
            <button
              style={{ marginRight: "20px" }}
              className=" btn "
              onClick={createPurchase}
              disabled={!idFromValid || !isAddNewClicked || isSaving}
            >
              Save
            </button>
          </div>
          <table className=" table ">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">No.</th>
                <th scope="col">Product Name</th>
                <th scope="col">Brand</th>
                <th scope="col">Category</th>
                <th scope="col">MRP</th>
                <th scope="col">Quantity</th>
                <th scope="col"></th>
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
                        &#43;
                      </span>
                    )}
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <input
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
                      &times;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          (name == "quantity_available" ? value : e.quantity_available)
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
      <h4 className="heading-text mb-3">Purchase</h4>
      <div style={{ marginRight: "20px" }} className=" mb-3 text-end">
        <button
          className="btn"
          onClick={() => {
            setIsUpdate(false);
            setIsFromValid(false);
            setIsAddNewClicked(!isAddNewClicked);
            setPopUpTitle("Create Purchase");
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
            toggleModal();
          }}
        >
          Add New
        </button>
      </div>
      {PurchaseTable()}
      {addIteamInPurchasePopUp()}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Purchase;
