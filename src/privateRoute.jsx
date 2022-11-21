import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from './components/Authentication/util';


// const PrivateRoute = ({component: Component, ...rest}) => {

//     return (

//         // Show the component only when the user is logged in
//         // Otherwise, redirect the user to /signin page
//         <Route {...rest}  render= {(props) => {
//           var component = (<Component {...props} />);
//         	 await isLogin()
//         	.then( (result)=>{
//         		alert(result)
//         		if(result){
//         		component =  (<Component {...props} />)


//         		}
//         		alert("okay let go")
//                   component =  (<Redirect to="/" />)



//         	},
        	
        
  
// 	     (error) => { 

// 	      	console.log(error.response) 
// 	        component =  (<Redirect to="/" />)

// 	      }

//         	)
//    alert("fini")
//               return component


//         }





//         } />
//     );
// };

//export default PrivateRoute;

  class PrivateRoute extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      isAuthenticated: true
    }
  }

 async componentDidMount() {
 await 	isLogin()
      .then(async (result)=>{
        if(result){
        	//alert("yep")
       await   this.setState({
      		isAuthenticated: true
      	})



        }
        else{

        this.setState({
      		isAuthenticated: false
      	})

        }

         })

          await this.setState({
      		loading: true
      	})
 
  }

  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props =>
        this.state.loading? 
          this.state.isAuthenticated ? (
            <Component {...props} />
          ) : 
              <Redirect to="/" />     
          :  <span>Redirecting.............</span>           
            
        }
      />
    )
  }
}      	
export default PrivateRoute;
