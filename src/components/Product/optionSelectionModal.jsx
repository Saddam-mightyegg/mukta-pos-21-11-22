import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { areEqual } from "../helpers/formElement.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { Woocommerce } from "../functions/Woocommerce";

var color = "";
var size = "";
var color_option = [];
var attributes_list = [];
var selectedOption = {};
var stack_list = [];
var variation_id = "";

class OptionSelectionModal extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    show: false,
    dropdownlist: [],
    original_stack_list: [],
    selectedOption: {},
    loadingIndicator: false,
    disableAdd: false,
    selected: {},
    loading: true,
  };

  dropdown() {
    var obj = [];
    attributes_list = color_option.map((item, idx) => {
      var attr = item.attributes.map((attr, x) => {
        obj[attr.name] = obj[attr.name] ? obj[attr.name] : [];
        obj[attr.name].push(attr.option);
        obj[attr.name] = obj[attr.name].filter(
          (item, index) => obj[attr.name].indexOf(item) === index
        );
      });
      // return obj;
    });

    this.setState({
      dropdownlist: obj,
    });
  }
  variation(props) {
    var object = [];

    props.variation.map((item, idx) => {
      object[item.name] = object[item.name] ? object[item.name] : [];
      object[item.name] = item.options.map((radio, idx2) => {
        var o = [];

        o.push(radio);

        return o;
      });
    });
    const returnedTarget = Object.assign({}, object);
    //console.log(returnedTarget)

    this.setState({
      dropdownlist: object,
      original_stack_list: returnedTarget,
    });
  }
  getAllVariation = (product_id) => {
    this.setState({
      loading: true,
    });
    color_option = [];

    Woocommerce.getProductVariation(product_id).then((res) => {
      color_option = res.data;
      // console.log(color_option)
      this.setState({
        loading: false,
      });

      this.dropdown();
    });
  };

  renderbase = () => {};

  dependencySelection = async (name, value) => {
    var selectedOption = this.state.selectedOption;
    var selected = this.state.selected;

    selectedOption[name] = value;
    selected[name] = value;

    if (value == "0") {
      delete selectedOption[name];
    }
    await this.setState({
      selectedOption: selectedOption,
      selected: selected,
    });
    //  console.log(selectedOption)

    var obj = [];

    if (
      !(
        Object.keys(selectedOption).length === 0 &&
        selectedOption.constructor === Object
      )
    ) {
      Object.entries(selectedOption).map((item, k) => {
        const [a, b] = item;

        color_option.map((item, idx) => {
          var status_to_push = false;
          var attr = item.attributes.map((attr, x) => {
            // console.log(attr)

            if (b === attr.option) {
              status_to_push = true;
            }
          });

          var attr = item.attributes.map((attr, x) => {
            //console.log(item)

            // obj[k] = obj[k]? obj[k]: []
            obj[attr.name] = obj[attr.name] ? obj[attr.name] : [];

            if (status_to_push) {
              obj[attr.name].push(attr.option);
            }
            // obj[attr.name]=  obj[attr.name].filter((item, index) =>  obj[attr.name].indexOf(item) === index);
          });
          // return obj;
        });
      });

      color_option.map((item, idx) => {
        var status_to_push = false;
        var attr = item.attributes.map((attr, x) => {
          // console.log(attr)
          if (obj[attr.name] && obj[attr.name].length > 0) {
            let counts = obj[attr.name].reduce((a, c) => {
              a[c] = (a[c] || 0) + 1;
              return a;
            }, {});
            let maxCount = Math.max(...Object.values(counts));
            let mostFrequent = Object.keys(counts).filter(
              (k) => counts[k] === maxCount
            );
            obj[attr.name] = mostFrequent;
          }
        });

        // return obj;
      });
      await this.setState({
        dropdownlist: obj,
      });
    } else {
      var obj = this.state.original_stack_list;
      await this.setState({
        dropdownlist: obj,
      });
    }

    //console.log(obj)
  };
  async shouldComponentUpdate(nextProps, nextState) {
    if (this.props.show != nextProps.show && nextProps.show === true) {
      await this.setState({
        dropdownlist: [],
        original_stack_list: [],
        selectedOption: {},
        loadingIndicator: true,
        show: false,
        disableAdd: false,
        selected: {},
        loading: true,
      });

      await this.getAllVariation(this.props.product_id);
      await this.variation(this.props);
      await this.setState({
        loadingIndicator: false,
      });

      return true;
    }
    return false;
  }

  sendToCart = async () => {
    var forvariationList = this.state.selectedOption;
    var obj = [];
    var checkselectedgtoup = [];
    checkselectedgtoup = color_option.filter((item, idx) => {
      var status = true;
      var attr = item.attributes.map((attr, x) => {
        if (forvariationList[attr.name] != attr["option"]) {
          status = false;
        }
      });

      this.props.handleClose();

      if (status) {
        return true;
      }
      return false;
      // return obj;
    });

    if (checkselectedgtoup.length > 0) {
      var stock_status = checkselectedgtoup[0].stock_status;

      variation_id = checkselectedgtoup[0].id;
      if (stock_status === "instock") {
        this.props.addToTheCart(
          this.props.idx,
          this.state.selectedOption,
          variation_id
        );
      } else {
        alert("Out of stock");

        // await this.setState({
        //   disableAdd: true
        // })
      }
    }
  };

  async componentDidMount() {
    // await this.getAllVariation(this.props.product_id)
    // await this.variation(this.props)
    //this.renderbase();
  }

  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          keyboard={true}
          onHide={this.props.handleClose}
        >
          <Modal.Header closeButton>Variation</Modal.Header>

          <Modal.Body>
            {this.state.loadingIndicator && (
              <div className="loading  d-flex justify-content-center">
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            )}

            <div>
              {this.state.loading && "Loading quantity information ......"}
              <div className="variation_quantity">
                {color_option.map((item, idx) => {
                  return (
                    <div>
                      {item.attributes.map((attr, x) => {
                        return (
                          <span class="mr-1">
                            <b class="mr-1">{attr.name}:</b>
                            {attr.option}
                          </span>
                        );
                      })}

                      <b class="mr-1">Quantity:</b>

                      {item.stock_quantity}
                    </div>
                  );
                })}
              </div>
              {Object.entries(this.state.dropdownlist).map((item) => {
                const [key, value] = item;

                return (
                  <div className="row m-2">
                    <Form.Control
                      as="select"
                      onChange={(e) =>
                        this.dependencySelection(key, e.target.value)
                      }
                      value={this.state.selected[key]}
                      disabled={this.state.loading}
                    >
                      <option value="0">Choose {key}</option>
                      {value.map((item, idx) => (
                        <option value={item}>{item}</option>
                      ))}
                    </Form.Control>
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="add-product-icon flaticon-add grid btn btn-primary active"
              disabled={this.state.disableAdd}
              onClick={this.sendToCart}
            >
              Add
            </button>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default OptionSelectionModal;
