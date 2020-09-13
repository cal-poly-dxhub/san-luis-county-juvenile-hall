 /* eslint-disable */
import React from 'react';
import MaterialTable from 'material-table';
import { forwardRef, useState, useEffect } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Rewards from '../Rewards/Rewards';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

/*  {
        "claim_id": 1,
        "officer": 0,
        "date_time": "2020-03-29 01:45:34",
        "points": -5,
        "purchases": [
            {
                "name": "Erase 1 RT or School Referral",
                "quantity": 2
            }
        ]
    }*/

export default function Transactions(props) {
  const [checked, setCheck] = React.useState(false);
  const [columns, setColumns] = React.useState([
        { title: "ID", field: "claim_id"},
        { title: "Date", field: "date", defaultSort:'desc'},
        { title: "Officer", field: "officer"},
        { title: "Subtotal", field: "points"},
        { title: "Item Name", field: "name"},
        { title: "Unit Price", field: "unit"},
        { title: "Quantity", field: "quantity"}
   ])
   const [transactions, setTransactions] = React.useState([]);
   const [anchorEl, setAnchorEl] = React.useState(null);
   const [hide, setHide] = React.useState(false);
   const [modifications, setModifications] = React.useState([]);

  function editPurchase(trans){
    var details = { 
        "claim_id": trans.claim_id,
        "officer": trans.officer,
        "date": trans.date,
        "points" : trans.subtotal
    }
    var items = trans.purchases.map((p, i)  =>
      {
        return  {
        "claim_id": "",
        "name" : p.name,   
        "unit": p.unit_price,
        "quantity" : p.quantity,
        "parentId": trans.claim_id
        }
      });
    items.unshift(details);
    return items;
  }

  /*date: "2020-05-01"
officer: "guest1"
points: 0*/

  function editData(data){
    data[0] = data[0].map(trans => editPurchase(trans));
    data[0] = data[0].flat();
    data[1] = data[1].filter(mods => mods.points !== 0);
   // console.log(data[1])
    data[1] = data[1].map(mods => {
      mods["claim_id"] = ""; 
      return mods;
    });
   // console.log(data[0].concat(data[1]));
    setTransactions(data[0].concat(data[1]));
  }

  useEffect(() => {
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    var transURL = "https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/fetch/transactions?juvenile_id=" + props.id;
    var modURL = "https://65erq8gstf.execute-api.us-west-2.amazonaws.com/prod/fetch/modifications?juvenile_id=" + props.id;
    Promise.all([
      fetch(transURL, {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(data =>  data),
      fetch(modURL, {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json',
        }
      }).then(response => response.json())
        .then(data =>  data)
    ]).then(allResponses => editData(allResponses))
  }, []);

       /* fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
      }
    })
     .then(response => response.json())
     .then(data =>  editData(data));
   }, []);*/

   /*useEffect(() => {
    var bearer = 'Bearer ' + props.session.credentials.idToken;
    var url = "https://dzlcmr90dj.execute-api.us-west-2.amazonaws.com/beta/retrieve/modifications?juvenile_id=" + props.id;
    fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json',
      }
    })
     .then(response => response.json());
     .then(data =>  setTransactions(transactions.concat(data)
   }, []);*/

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    props.logout();
  }
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExit = () => {
    setHide(true);
  }

  const handlePrint = () => {
    setCheck(!checked);
  }

  return (
    hide? <Rewards session = {props.session} userID = {props.id} userTotal = {props.points} userName = {props.name}
    show = {props.logout} /> :
   <div style = {checked? {margin: '0px'} : {marginLeft: '15%', marginTop: '5%', width:"70%"}}>
   <AppBar position="static">
       <Toolbar>
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
                <MenuItem onClick={handleExit}>Back to Rewards</MenuItem>
              </Menu>
              <div style={{marginRight:"5%"}}>
              <p>
                {props.name}
              </p>
              </div>
              <div><p>{props.points} Points</p></div>
              <FormGroup style={{marginLeft: "10%"}}>
                <FormControlLabel
                  control={
                            <Switch
                              checked={checked}
                              onChange={handlePrint}
                            />
                          }
                  label="Print Mode"
                />
              </FormGroup>
       </Toolbar>
    <MaterialTable
      title="Transactions"
      icons={tableIcons}
      columns={columns}
      data={transactions}
      parentChildData={(row, rows) => rows.find(a => a.claim_id === row.parentId)}
      options={{
        defaultExpanded: true,
        paging: !checked,
        emptyRowsWhenPaging: false
      }}
    /> 
    </AppBar>
   </div>
  );
}

  /* editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}*/