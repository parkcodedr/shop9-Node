import React, { useEffect, useState, useRef } from "react";
import "./create-order.styles.scss";


import { Spinner } from 'react-bootstrap';

import { FaCaretLeft, FaPlusCircle } from "react-icons/fa";

import { withRouter } from "react-router";
import InputComponent from "../../../components/input/input.component";
import PhoneInput from "react-phone-input-2";
import TextArea from "../../../components/text-area/text-area.component";

import { currencies } from "../../../constants/constant.js"
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import CustomToggle from "../../../components/custom-toggle/custom-toggle.component";
import CustomButton from "../../../components/custom-button/custom-button.component";
import { useDispatch, useSelector } from "react-redux";
import { handleRequest } from "../../../redux/actions/actionCreator";
import * as types from "../../../redux/actions";
import moment from "moment";
import { toast } from "react-toastify";

const CreateOrder = ({ history }) => {
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.loading);

    const fileInput = useRef(null)

    const [txnType, setTxnType] = useState();
    const [inputValues, setInputValues] = useState({});
    const [txnImages, setTxnImages] = useState([]);
    const [orderFiles, setOrderFiles] = useState([]);
    const [isInstalment, setInstalments] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const [removedOrderFiles, trackRemovedOrderFiles] = useState([]);


    const handleChange = (event) => {
        const { value, name } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const selectTxnType = (type) => {
        setTxnType(type);
        setInputValues({ ...inputValues, transaction_type: type });
    };

    const handlePhoneInput = (event) => {
        setInputValues({ ...inputValues, seller_phone: event });
    };

    const flows = (e) => {
        const image = e?.target?.files[0];
        if (image) {
            const imgHasBeenSelected = txnImages.filter(img => img.name == image.name).length > 0;
            if (imgHasBeenSelected) return

            const filesize = ((image.size / 1024) / 1024).toFixed(4);
            if (filesize > 1) {
                toast.error("File Size is over 1MB")
                return
            }
            setTxnImages([...txnImages, image]);
            fileInput.current.value = null
        }
    };

    const onDateChange = (startDate, endDate) => {
        setInputValues({
            ...inputValues,
            start_date: startDate,
            end_date: endDate,
        });
    };

    const allowInstalment = (e) => {
        setInstalments(e.target.checked);
    };

    const handleSubmit = () => {
        dispatch(handleRequest(types.CREATE_ORDER, { history, inputValues }));

        const viewImage = (link) => window.open(link);

        const handleSubmit = () => {
            const fd = new FormData()
            const isUpdateOrder = inputValues.orderID || false

            if (!isUpdateOrder) {
                txnImages.map(image => {
                    fd.append('order_docs[]', image)
                })
            }

            for (const key in inputValues) {
                if (["start_date", "end_date"].includes(key)) {
                    fd.append(key, new moment(inputValues[key]).format())
                }
                else {
                    fd.append(key, inputValues[key])
                }
            }

            if (isUpdateOrder) {
                const update = new FormData()
                removedOrderFiles.map((link => {
                    update.append('remove_order_docs[]', link)
                }))
                txnImages.map(image => {
                    update.append('add_order_docs[]', image)
                })
                update.append('orderID', inputValues.orderID)
                dispatch(handleRequest(types.UPDATE_ORDER_DOCS, update));
            }

            dispatch(handleRequest(isUpdateOrder ? types.UPDATE_ORDER : types.CREATE_ORDER, { history, inputValues: fd }));

        };
    }

    const renderImage = (image) => {
        return URL.createObjectURL(image)
    }


    useEffect(() => {
        setInputValues({ ...inputValues, pay_in_installments: 0 });
    }, []);

    useEffect(() => {
        if (history.location.state) {
            let obj = history.location.state;
            setInputValues({
                orderID: obj.orderID,
                seller_email: obj.sellerEmail,
                transaction_type: obj.transactionType,
                pay_in_installments: obj.pay_in_installments || 0,
                seller_phone: obj.sellerPhone,
                description: obj.description,
                cost: obj.cost,
                currency: obj.currency,
                //this is a dirty hack, the backend poorly handle dates
                start_date: new moment(obj.startDate.split("-").reverse().join("-")),
                end_date: new moment(obj.endDate.split("-").reverse().join("-"))
            });
            setInstalments(obj.pay_in_installments)
            setTxnType(obj?.transactionType);
            setOrderFiles(obj?.orderFiles)
            setIsEditable(true);
        } else {
            setIsEditable(false);
        }
    }, []);

    return (
        <div className="create-transaction">
            <div className="navigation-div">
                <div
                    className="back-button__div cursor"
                    onClick={() => history.push("/app/orders")}
                >
                    <FaCaretLeft />
                </div>

                <h5 className="primary-text">
                    {isEditable ? "Edit" : "Create"} an Order
        </h5>
            </div>

            <hr />

            <div className="card p-5">
                <div className="d-inline-flex align-items-center">
                    <div className="blue-dot"></div>
                    <p className="primary-text mb-0 ml-2">Seller’s information</p>
                </div>

                <hr />

                <div className="col-md-10 mx-auto mt-4">
                    <div className="row">
                        <div className="col-md-6">
                            <InputComponent
                                name="seller_email"
                                label="Email Address"
                                value={inputValues?.seller_email}
                                type="email"
                                placeholder="Email Address"
                                handleChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <PhoneInput
                                country={"ng"}
                                value={inputValues?.seller_phone}
                                name="seller_phone"
                                onChange={($event) => handlePhoneInput($event)}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-inline-flex align-items-center">
                    <div className="blue-dot"></div>
                    <p className="primary-text mb-0 ml-2">Item or service information</p>
                </div>

                <hr />

                <div className="col-md-10 mx-auto">
                    <p className="text-secondary">What type of transaction is this?</p>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="txn-type__div">
                                <div
                                    className={`items cursor ${txnType === "item" ? "selected-type" : ""
                                        }`}
                                    onClick={() => selectTxnType("item")}
                                >
                                    item
                </div>
                                <div className="item-border__right"></div>
                                <div
                                    className={`items cursor ${txnType === "services" ? "selected-type" : ""
                                        }`}
                                    onClick={() => selectTxnType("services")}
                                >
                                    Service
                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-secondary mt-4">
                        Upload item image or document{" "}
                        <small>(JPG and PNG files are allowed for upload)</small>
                    </p>

                    <div className="row mt-2">
                        <div className="col-md-2 mb-3">
                            <div className="upload-order__image cursor">
                                <input
                                    ref={fileInput}
                                    onChange={($event) => flows($event)}
                                    type="file"
                                    className="txn-image__upload cursor"
                                    accept="image/jpeg,image/jpg,image/png"
                                />
                                <FaPlusCircle className="add-icon cursor" />
                            </div>
                        </div>

                        {txnImages && txnImages.map((image, index) => (
                            <>
                                <div key={index} className="col-md-2 mb-3 order__preview_container">
                                    <img className="upload-order__preview" src={renderImage(image)} />
                                    <div className="overlay py-2">
                                        <div
                                            className="action"
                                        >
                                            <FaEye onClick={() => {
                                                viewImage(renderImage(image))
                                            }} color="#000" />{" "}<FaTrash onClick={() => {
                                                setTxnImages(txnImages.filter(img => img.name !== image.name))
                                            }} color="#000" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                        {orderFiles && orderFiles.map(({ link }, index) => (
                            <>
                                <div key={index} className="col-md-2 mb-3 order__preview_container">
                                    <img className="upload-order__preview" src={link} />
                                    <div className="overlay py-2">
                                        <div
                                            className="action"
                                        >
                                            <FaEye onClick={() => {
                                                viewImage(link)
                                            }} color="#000" />{" "}<FaTrash onClick={() => {
                                                trackRemovedOrderFiles([...removedOrderFiles, link])
                                                setOrderFiles(orderFiles.filter(file => file.link !== link))
                                            }} color="#000" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>

                    <div className="row">
                        <div className="col-md-12 mt-4 pt-1">
                            <TextArea
                                id="description"
                                name="description"
                                value={inputValues?.description}
                                label="Item description"
                                row="100"
                                cols="50"
                                handleChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <InputComponent
                                name="cost"
                                value={inputValues?.cost}
                                label="Cost of item"
                                type="text"
                                placeholder="Cost of item"
                                handleChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <select
                                className="form-control"
                                name="currency"
                                value={inputValues?.currency}
                                id="currency"
                                onChange={handleChange}
                            >
                                <option value="">Currency</option>
                                {
                                    currencies.map(({ label, value }) => <option key={value} value={value}>{`${label} (${value})`}</option>
                                    )}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-10">
                            <RangeDatePicker
                                onChange={(startDate, endDate) =>
                                    onDateChange(startDate, endDate)
                                }
                                minDate={new Date()}
                                maxDate={new Date(2100, 0, 1)}
                                startDate={inputValues?.start_date}
                                endDate={inputValues?.end_date}
                                dateFormat="DD MMM YYYY"
                                monthFormat="DD MMM YYYY"
                                startDatePlaceholder="Start Date"
                                endDatePlaceholder="End Date"
                                disabled={false}
                                className="my-own-class-name"
                                startWeekDay="monday"
                            />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-8">
                            <p className="text-secondary mt-4 mb-0">
                                Allow payment in instalments
              </p>
                            <p className="text-secondary small">
                                This must be mutually agreed upon between you and the seller
              </p>
                        </div>

                        <div className="col-md-4 my-auto">
                            <CustomToggle
                                allowInstalment={allowInstalment}
                                isInstalment={isInstalment || inputValues.pay_in_installments > 0}
                            />
                        </div>
                    </div>

                    {(isInstalment || inputValues.pay_in_installments > 0) && (
                        <div className="row">
                            <div className="col-md-6">
                                <select
                                    className="form-control"
                                    name="pay_in_installments"
                                    id="installments"
                                    onChange={handleChange}
                                >
                                    <option value="">Select number of instalments</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="row mt-5">
                        <div className="col-md-3 ml-auto">

                            <CustomButton onClick={!isEditable ? handleSubmit : onEditOrder}>
                                {isLoading && <Spinner className="mr-1" animation="border" size="sm" />}
                                {isEditable ? "Edit" : "Create"} order

              </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default withRouter(CreateOrder);