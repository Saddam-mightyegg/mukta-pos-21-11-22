import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/grid.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Woocommerce from "./functions/Woocommerce";
import defaultImg from  "../defaultImg.png";
import OptionSelectionModal from "./Product/optionSelectionModal";


class ProductsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       products: [],
       isLoaded: false,
       show: false,
       idx: null,
      variation: [],
      product_id: null
    };
  }



 handleShow = async(idx,variation,product_id) => {

  await this.setState({
    idx: idx,
    variation: variation,
    product_id: product_id,
    
  })


  await this.setState({
    show: true,

    
  })



 }



  handleClose = () => {

  this.setState({
      show: false,
       idx: null,
      variation: [],
      product_id: null
        })



 }


  render() {
    let columns=[];
    this.props.products.forEach((item,idx) => {
      var ret = item.short_description.replace('<p>','');
      ret = ret.replace('</p>','');
      var fullname = item.name + " " + ret;
        // push column
        columns.push(
          <div className="grid_col item" key={idx}>
            <div className="item-wrap" 

             >
              <div className="img" style={{ backgroundImage: `url(${item.images[0] !== undefined?item.images[0].src : defaultImg})` }}>
              </div>
              <div className="title">
                {fullname}
              </div>
              {
                item.attributes.length>0?
                 <a 
                   className= {item.stock_status =="instock"?"add-product-icon flaticon-add grid ": "add-product-icon flaticon-add grid btn disabled" }
                   onClick={(e) =>this.handleShow(idx,item.attributes,item.id)}
                 >
                <FontAwesomeIcon icon={faPlus}  className="plus_icon"/>
             </a>
              :
              <a 

               className= {item.stock_status =="instock"?"add-product-icon flaticon-add grid ": "add-product-icon flaticon-add grid btn disabled" }

               data-index = {idx} onClick={() => this.props.addToTheCart(idx)} >
                <FontAwesomeIcon icon={faPlus} data-index = {idx} className="plus_icon"/>
              </a>
            }
             

            </div>
          </div>
        )
    })


    return (
        <div className="row content_grid">
        {columns}
            <OptionSelectionModal
                idx = {this.state.idx}
                variation = {this.state.variation}
                product_id = {this.state.product_id}
                addToTheCart = {this.props.addToTheCart}
                show = {this.state.show}
                handleClose = {this.handleClose}
              />
        </div>
    )
  }
}

export default ProductsGrid;
