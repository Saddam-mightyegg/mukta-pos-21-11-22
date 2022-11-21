import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/list.css";
import Woocommerce from "./functions/Woocommerce";
import defaultImg from "../defaultImg.png";
import OptionSelectionModal from "./Product/optionSelectionModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

class ProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoaded: false,
      show: false,
      idx: null,
      variation: [],
      product_id: null,
    };
  }

  handleShow = async (idx, variation, product_id) => {
    await this.setState({
      idx: idx,
      variation: variation,
      product_id: product_id,
    });

    await this.setState({
      show: true,
    });
  };

  handleClose = () => {
    this.setState({
      show: false,
      idx: null,
      variation: [],
      product_id: null,
    });
  };

  render() {
    let columns = [];
    this.props.products.forEach((item, idx) => {
      // push column
      // console.log("item check")
      // console.log(item)
      var ret = item.short_description.replace("<p>", "");
      ret = ret.replace("</p>", "");
      var fullname = item.name + " " + ret;
      columns.push(
        <div className="col-12 list_item" key={idx}>
          <div className="list_item_wrap item-wrap">
            <div
              className="img"
              style={{
                backgroundImage: `url(${
                  item.images[0] !== undefined ? item.images[0].src : defaultImg
                })`,
              }}
            ></div>
            <div className="list_product_wrap">
              <div class="product_name">{fullname}</div>
              <div class="product_sku">{item.sku}</div>
              <div class="product_price">৳&nbsp;{item.price}</div>
              <div
                class={
                  item.stock_status == "instock" ? "text-success" : "text-muted"
                }
              >
                {item.stock_status == "instock" ? "In Stock" : "Out of Stock"}
              </div>
              <div class="pull-right">
                {item.attributes.length <= 0
                  ? "Qty:" + item.stock_quantity
                  : "Contain variation"}
              </div>
            </div>

            {item.attributes.length > 0 ? (
              <a
                className={
                  item.stock_status == "instock"
                    ? "add-product-icon-list flaticon-add grid btn "
                    : "add-product-icon-list flaticon-add grid btn disabled"
                }
                onClick={(e) => this.handleShow(idx, item.attributes, item.id)}
              >
                <FontAwesomeIcon icon={faPlus} className="plus_icon" />
              </a>
            ) : (
              <a
                className={
                  item.stock_status == "instock"
                    ? "add-product-icon-list flaticon-add grid btn "
                    : "add-product-icon-list flaticon-add grid btn disabled"
                }
                data-index={idx}
                onClick={() => this.props.addToTheCart(idx)}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  data-index={idx}
                  className="plus_icon"
                />
              </a>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className="row m-3">
        {columns}
        <OptionSelectionModal
          idx={this.state.idx}
          variation={this.state.variation}
          product_id={this.state.product_id}
          addToTheCart={this.props.addToTheCart}
          show={this.state.show}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

export default ProductsList;
