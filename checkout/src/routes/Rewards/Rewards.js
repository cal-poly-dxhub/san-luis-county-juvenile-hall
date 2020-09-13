 /* eslint-disable */
//"https://slojhcheckout.calpoly.io/",
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Transactions from '../Transactions/Transactions'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '50%',
    height: '50%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
  listRoot: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  title: {
    flexGrow: 1
  }
}));


export default function Rewards(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [submit, setSubmit] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [viewTransaction, setTransaction] = React.useState(false);
  const [admin, setAdmin] = React.useState('');
  const [adjust, setAdjust] = React.useState(false);
  const isAdmin = props.session.credentials.groups 
    && props.session.credentials.groups.includes("Administrators");

  const handleAdmin = (event) => {
    setAdmin(event.target.value);
  };

  const handleAdjust = () => {
    setAdjust(!adjust);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackClose = () => {
    props.show();
    setQuantity({});
    setTotal(0);
    clearCart();
  }

  const inputStyle = {
    width: "10%", 
    textAlign: "center"
  }

  const divStyle = {
    marginLeft : 'auto', 
    marginBottom: "10px", 
    overflow : "hidden", 
    width: "40%", 
    height: "40%"
  }

  useEffect(() => { 
    var url = "https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/fetch/rewards"
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    //console.log(bearer);
    fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function isSameItem(items) {
    return function(product) {
      return items.find(x => x === product.name);
    }
  }

  function onIncrement(id, price) {
    var name = "item" + id;
    var count = parseInt(quantity[name]);
    var product = products.find(p => p.id === id);
    //console.log(id, product, count);
    count++;
    setQuantity({
      ...quantity,
      [name]: count.toString()
    });
    setTotal(price + total);
  }

  function onDecrement(id, price) {
    var name = "item" + id;
    var count = parseInt(quantity[name]);
    count--;
    setQuantity({
      ...quantity,
      [name]: count.toString()
    });
    if (total - price <= 0)
      setOpen(false);
    setTotal(total - price);
  }

  function checkValidIncrement(id){
    var name = "item" + id;
    var count = parseInt(quantity[name]);
    var product = products.find(p => p.id === id);
    if (!product)
      return;
    if (parseInt(product.max_quantity) < count + 1) {
      return true;
    }
    return false;
  }

  function checkValidDecrement(id){
    var name = "item" + id;
    var count = parseInt(quantity[name]);
    if (count === 0){
      return true;
    }
    return false;
  }

  function getCategoryList(name){
    var tabProducts = products.filter(p => p.category === name);
   // console.log(tabProducts);
    return tabProducts.map(p => {
      if (quantity["item" + p.id] === undefined)
        quantity["item" + p.id] = 0;
      return (
        <ListItem key={p.id}>
          <ListItemAvatar>
            <Avatar className={classes.large} style = {{marginRight: "20px"}}>
              <img style={{"maxWidth" :"100%", "maxHeight" : "100%"}} src = {p.image} alt={p.name} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={p.name} secondary={p.price + " coupons"} />
          <ListItemSecondaryAction style = {{marginTop: "10px"}}>
            <Button color="primary" disabled = {checkValidDecrement(p.id)}
              onClick = {() => onDecrement(p.id, p.price)}><b>-</b></Button>
            <input style = {inputStyle} 
              type="text" name={"item" + p.id}
              value = {quantity["item" + p.id]}
              readOnly
              onKeyDown = {e =>  e.preventDefault()}/>
            <Button color="primary" disabled = {checkValidIncrement(p.id)} 
              onClick = {() => onIncrement(p.id, p.price)}><b>+</b></Button>
            <Typography variant="caption" display="block" gutterBottom>*{p.max_quantity} per checkout</Typography>
          </ListItemSecondaryAction>
        </ListItem>
      );
    })
  }
  var cart_items = [];
  function addToCart(){
    var keys = Object.keys(quantity);
    var items = keys.filter(key => quantity[key] && quantity[key] !== "0");
    items = items.map(item => parseInt((item.match(/\d+$/) || []).pop())); // extracts id from "name + id" string
    cart_items = items.map(id => {
      return (products.filter(prod => prod.id === id))[0];
    });
   
    var cart_list = cart_items.map(p => {
      return (
        <ListItem key={p.id}>
          <ListItemAvatar>
            <Avatar>
              <img style={{"maxWidth" :"100%", "maxHeight" : "100%"}} src = {p.image} alt={p.name} />
            </Avatar>
          </ListItemAvatar>
          <div style={{width: "30%"}}>
            <ListItemText primary={p.name} secondary={p.price + " coupons"} />
          </div>
          <ListItemSecondaryAction style = {{marginTop: "10px"}}>
            <Button color="primary" disabled = {checkValidDecrement(p.id)}
              onClick = {() => onDecrement(p.id, p.price)}><b>-</b></Button>
            <input style = {inputStyle} 
              type="text" name={"item" + p.id}
              value = {quantity["item" + p.id]}
              readOnly
              onKeyDown = {e =>  e.preventDefault()}/>
            <Button color="primary" disabled = {checkValidIncrement(p.id)} 
              onClick = {() => onIncrement(p.id, p.price)}><b>+</b></Button>
            <Typography variant="caption" display="block" gutterBottom>*{p.max_quantity} per checkout</Typography>
          </ListItemSecondaryAction>
        </ListItem>
      );
    })
    return cart_list;
  }

  function clearCart() {
    if(cart)
      setCart(false);
    return "";
  }
  //https://my-json-server.typicode.com/reclusivestar/testdata/Prss
  
  async function handleSubmit(){
    var reward_items = cart_items.map(p => {return ({"quantity" : parseInt(quantity["item" + p.id]), "reward" : p})});
    var data = {juvenile_id : props.userID, rewards : reward_items};
    console.log(data);
    console.log(props.userID);
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    try {
      var response = await fetch("https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/points/decr", {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw Error(response.statusText);
      }
      response = response.text();
      console.log(response);
      if (isAdmin)
        handlePoints();
      setSubmit(1);
    } catch (error) {
      console.log(error, data);
      setSubmit(-1);
    }
  }

  async function handlePoints() {
    var data =  {juvenile_id: props.userID, points: admin}
    console.log(data);
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    try {
      var response = await fetch("https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/points/admin", {
        method: 'POST',
        headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        response.text().then(text => {console.log(text)});
        throw Error(response.statusText);
      }
      response = response.text();
      console.log(response);
      setSubmit(1);
    } catch (error) {
      //error.text().then(text => {console.log(text)});
      console.log(error);
      setSubmit(-1);
    }
  }

  var cart_list = addToCart();

  const checkout = () => {
    //console.log(submit)
    return (
      <div className = {classes.paper}>
        <Typography variant="h5" gutterBottom>
      CHECKOUT
        </Typography>
        <div>
          <Typography color = {(props.userTotal - total) < 0 ? 'error' : 'primary'}>
     ACCOUNT BALANCE:  <b>{props.userTotal - total} coupons</b></Typography>
        </div>
        <Divider orientation='horizontal'/>
        {cart_list.length ?
          <div> 
            <List className={classes.listRoot}>
              {cart_list}
            </List> 
          </div> : clearCart()}
        <Divider orientation='horizontal'/>
        <div style = {{float: "left", marginTop: "10px"}}>
          <Typography>SUBTOTAL ({cart_list.length} items): <b>{total} coupons</b></Typography>            
        {isAdmin? <FormGroup>
          <FormControlLabel
          control={<Switch checked={adjust} onChange={handleAdjust}  />}
          label="*Adjust Point Total"
        />
        </FormGroup> : ''}
        {adjust? <form  noValidate autoComplete="off">
        <div>
        <TextField style={{width:'25%'}} id="admin" label="Points" value={admin} onChange={handleAdmin} />
        {/*<Button style={{marginTop:'10px', marginLeft:'10px'}} disabled={submit === 1} 
        variant="contained" color="primary" onClick={handlePoints}>Add to Cart</Button>*/}
        </div>
       </form> : ''}
       </div>
        <div style = {{float: "right", marginTop: "20px"}}>
          <Button variant="contained" color="primary"  disabled={submit === 1}
          onClick = {handleSubmit}>CHARGE {total} 
          {admin === ""? "" : parseInt(admin) > 0 ? " +" : " "} {admin} COUPONS</Button>
        </div>
        <Snackbar open={submit===1} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success">
          Successfully cashed in rewards!
          </Alert>
        </Snackbar> 
        <Snackbar open={submit===-1} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="error">
        Oops! Something went wrong :(
          </Alert>
        </Snackbar>
      </div>
    );
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    props.show();
  }
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleTransactions = () => {
    setTransaction(true);
  }
 
  return ( 
    viewTransaction? <Transactions id = {props.userID} session = {props.session} 
    points = {props.userTotal} name = {props.userName} logout={props.show} /> :
    <Container fixed style={{marginTop : "5%"}}>
      <div style = {{float:"left"}}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Behavior" {...a11yProps(0)} />
            <Tab label="Hygeine" {...a11yProps(1)} />
            <Tab label="Sweets" {...a11yProps(2)} />
            <Tab label="Snack/Drink"  {...a11yProps(3)}/>
            <Tab label="Time"  {...a11yProps(4)}/>
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <List className={classes.listRoot}>
            {getCategoryList("Behavior")}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List className={classes.listRoot}>
            {getCategoryList("Hygeine")}
          </List>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List className={classes.listRoot}>
            {getCategoryList("Sweets")}
          </List>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <List className={classes.listRoot}>
            {getCategoryList("Snack/Drink")}
          </List>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <List className={classes.listRoot}>
            {getCategoryList("Time")}
          </List>
        </TabPanel>
      </div>
      <div style={{marginLeft: "auto", width: "35%"}}> 
        <AppBar position="static" style = {{height: "49px"}}>
          <Toolbar>
            <IconButton style={{marginBottom: "10px"}}>
              <ShoppingCartOutlinedIcon style={{color:"white"}}/>
            </IconButton>
            <div style={divStyle}>
              <Typography>
                {props.userName}
              </Typography>
            </div>
            <div style = {divStyle}>
              <b>{" " + props.userTotal + " "} pts  </b>
            </div>
            <div style={{marginLeft : '10px', marginBottom: "10px"}}>

              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleLogout}>Back To Juvenile Selection</MenuItem>
                <MenuItem onClick={handleTransactions}>View Transactions</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <div style = {{marginTop:"20px", marginBottom: "10px"}}>
          <Typography color = {(props.userTotal - total) < 0 ? 'error' : 'primary'}>
          ACCOUNT BALANCE: <b>{props.userTotal - total} coupons</b></Typography>
        </div>
        <Divider orientation='horizontal'/>
        {cart_list.length ?
          <div> 
            <List className={classes.listRoot}>
              {cart_list}
            </List> 
          </div> : clearCart()}
        <Divider orientation='horizontal'/>
        <div style = {{marginTop: "10px"}}>
          <Typography>SUBTOTAL ({cart_list.length} items): <b>{total} coupons </b></Typography>
        </div>
        <div style = {{marginTop: "10px"}}>
          {total > 0 ? 
            (props.userTotal - total) < 0 ? 
              <Button variant="contained" disabled>
        INSUFFICIENT FUNDS *ADJUST CART
              </Button>
              : <Button onClick={handleOpen} 
                variant="contained" color="primary">
          REVIEW & CHECKOUT
              </Button> : ""}
        </div>
        <div style = {{float: "left", marginTop: "10px"}}>
        {isAdmin? <FormGroup>
          <FormControlLabel
          control={<Switch checked={adjust} onChange={handleAdjust}  />}
          label="*Adjust Point Total"
        />
        </FormGroup> : ''}
        {adjust? <form  noValidate autoComplete="off">
        <div>
        <TextField style={{float: "left", width:'30%'}} id="admin_main" label="Points" value={admin} onChange={handleAdmin} />
        <Button style={{marginTop:'10px'}} disabled={submit === 1} 
        variant="contained" color="primary" onClick={handlePoints}>Submit</Button>
        </div>
       </form> : ''}
        </div>
        <Snackbar open={submit===1} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success">
          Successfully cashed in rewards!
          </Alert>
        </Snackbar> 
        <Snackbar open={submit===-1} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="error">
        Oops! Something went wrong :(
          </Alert>
        </Snackbar>
        
        {total?  
          <Modal disableBackdropClick={submit === 1} className={classes.modal} open={open} onClose={handleClose}>
            {checkout()}      
          </Modal> : ""}
      </div>
    </Container>
  );
}

/*const categories = {
  "Behavior" : [ "Erase 1 Timeout" , "Erase 1 RT or School Referral"],
  "Hygeine" : ["Deodorant",  "Colgate Toothpaste",  "Shampoo", "Toothbrush",
    "5 min extra in the shower",  "Head ‘N Shoulders Dandruff Shampoo", "Lip Balm",
    "Dial Body Wash", "Clean and Clear Face Wash"],
  "Time" : [  "5-minute non-collect phone call" , "5 min extra in the shower"],
  "Sweets" : ["Milky Way dark",
    "3 Musketeers" ,
    "Milky Way" ,
    "Twix" ,
    "Sour Punch Twist",
    "Oreos" , 
    "Chips Ahoy" ,
    "Rice Krispies Treats" ,
    "Kellog’s Pop Tart"],
  "Snack/Drink" : [  "Slim Jim" ,
    "Dark Chocolate Chunk"  ,
    "Chocolate Chip"  ,
    "Kellogg’s Strawberry"  ,
    "Blueberry Fruit Bar"  ,
    "Mott’s Fruit Snacks"  ,
    "Chips Ahoy"  ,
    "Hot Cheetos"  ,
    "Takis"  ,
    "Coconut Chocolate Chip"  ,
    "White Chocolate Macadamia Nut"  ,
    "Chocolate"  ,
    "Brownie"  ,
    "Kellogg’s Pop Tart (Strawberry, Cherry, Blueberry)"  ,
    "Gatorade"]
};

const images = {
  "Erase 1 Timeout" : 'assets/timeout.png', 
  "Erase 1 RT or School Referral" : 'assets/referral.jpg',
  "Deodorant" : 'assets/deodorant.jpg',
  "Colgate Toothpaste" : 'assets/colgate.jpg',
  "Shampoo" : 'assets/shampoo.jpg',
  "Toothbrush" : 'assets/toothbrush.jpg',
  "5 min extra in the shower" : 'assets/shower.jpg',
  "Head ‘N Shoulders Dandruff Shampoo" : 'assets/shampoo.jpg',
  "Lip Balm" : "assets/balm.jpg",
  "Dial Body Wash" : "assets/bodywash.jpg",
  "Clean and Clear Face Wash" : "assets/facewash.jpg",
  "5-minute non-collect phone call" : "assets/phonecall.jpg",
  "Milky Way dark" : "assets/milkydark.jpg",
  "3 Musketeers" : "assets/musketeers.jpg",
  "Milky Way" : "assets/milkyway.jpg",
  "Twix" : "assets/twix.jpg",
  "Sour Punch Twist" : "assets/twists.jpg",
  "Oreos" : "assets/oreos.jpg", 
  "Chips Ahoy" : "assets/chipsahoy.jpg" ,
  "Rice Krispies Treats" : "assets/krispies.png",
  "Slim Jim" : "assets/slimjim.jpg",
  "Dark Chocolate Chunk" : "assets/kind.jpg" ,
  "Chocolate Chip" : "assets/cliffchoc.jpg",
  "Blueberry Fruit Bar" : "assets/blueberry.jpeg" ,
  "Hot Cheetos" : "assets/cheetos.jpg",
  "Takis" : "assets/takis.jpg" ,
  "Coconut Chocolate Chip" : "assets/cliffcoco.png",
  "White Chocolate Macadamia Nut" : "assets/cliffwhite.png" ,
  "Chocolate" : "assets/cliffchoc.jpg" ,
  "Brownie" : "assets/brownie.jpg"
}*/


