import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from "react";
import jwt from 'jwt-decode';
import { deleteCRMData, getCRMData, logout, setCRMData, updateCRMData } from 'src/utils/auth';
import { openDialogue, setAlert } from "src/utils/helpFunc";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import ColorPicker from "material-ui-color-picker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import moment from "moment";
import { useNavigate } from "react-router";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const Accordion = () => {
  const [rows, setRows] = useState([])
  const [fusionDomains, setFusionDomain] = useState([])
  const [unfilteredDomains, setUnfilteredDomain] = useState([])
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    updateDomains()
  }, [])

  const StyledTextField = styled(TextField)({
    "& label": {
      color: "black"
    },
    "& input": {
      color: "black"
    },
    "&:hover label": {
      fontWeight: 700
    },
    "& label.Mui-focused": {
      color: "black"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black"
      },
      "&:hover fieldset": {
        borderColor: "black",
        borderWidth: 2
      },
      "&.Mui-focused fieldset": {
        borderColor: "black"
      }
    }
  });
  const StyledSelect = styled(Select)({
    "& label": {
      color: "black"
    },
    "& input": {
      color: "black"
    },
    "&:hover label": {
      fontWeight: 700
    },
    "& label.Mui-focused": {
      color: "black"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black"
      },
      "&:hover fieldset": {
        borderColor: "black",
        borderWidth: 2
      },
      "&.Mui-focused fieldset": {
        borderColor: "black"
      }
    }
  });
  const StyledColorPicker = styled(ColorPicker)`
& .MuiInputBase-root {
  color: black;
  &:hover fieldset {
    borderColor: black;
    borderWidth: 2px;
  }
  & fieldset {
    border-color: black!important;
  }
}
& .MuiFormLabel-root {
  color: black;
}
& .MuiFormLabel-root.Mui-focused {
  color: black;
}
& .MuiInput-underline:after {
  borderBottomColor: black;
}
`;
  const ColorPickerContainer = styled.div`
position: relative;
display: inline-block;
width: -webkit-fill-available;
`;

  const ColorDisplay = styled.div`
position: absolute;
right: 12%;
top: 50%;
transform: translateY(-50%);
width: 30px;
height: 30px;
border: 1px solid white;
background-color: ${props => props.color};
`;

  function updateDomains() {
    getCRMData("domains/getAllDomainBack")
      .then(async (domains) => {
        let newRows = domains.map(domain => {
          return {
            uuid: domain?.uuid,
            fusionUuid: domain?.fusionUuid,
            fusionName: domain?.fusionName,
            color: domain?.color,
            name: domain?.name,
            blocked: domain?.blocked,
            user_count: domain?.users?.length,
            max_users: domain?.max_users,
            admin_email: domain?.users[0]?.email,
            logo: domain?.logo,
          }
        })
        await getCRMData(`domains/pullDomains`).then(r => {
          let filteredCurrDomain = newRows.filter(row => row?.fusionUuid).map(row => row?.fusionUuid)
          let filteredFusionDomain = Object.values(r?.result ?? {}).filter(domain => !(filteredCurrDomain.includes(domain?.fusionUuid))).reduce((currDomains, newDomain) => {
            currDomains[newDomain?.fusionUuid] = newDomain?.fusionName
            return currDomains
          }, {})
          setUnfilteredDomain(Object.values(r?.result ?? {}).reduce((currDomains, newDomain) => {
            currDomains[newDomain?.fusionUuid] = newDomain?.fusionName
            return currDomains
          }, {}))
          setFusionDomain(filteredFusionDomain)
          setRows(newRows)
          setLoading(false)
        }).catch(err => {
          setRows(newRows)
          setLoading(false)
          console.log(err)
        })
      })
      .catch((e) => {
        console.log(e);
        setLoading(false)
      });
  }
  async function pullFusionDomain() {

  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: 'name',
      disablePadding: true,
      label: 'Domain',
    },
    {
      id: 'fusionName',
      disablePadding: true,
      label: 'Domain Fusion',
    },
    {
      id: 'blocked',
      disablePadding: false,
      label: 'Bloquer',
    },
    {
      id: 'user_count',
      disablePadding: false,
      label: 'Nb Utilisateurs',
    },
    {
      id: 'max_users',
      numeric: true,
      disablePadding: false,
      label: 'Max Utilisateurs',
    },
    {
      id: 'admin_email',
      disablePadding: false,
      label: "Email de l'administrateur",
    },
    {
      id: 'logo',
      disablePadding: false,
      label: 'Logo',
    },
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell>
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Nutrition
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );
  const ImagePreview = styled.img`
  display: block;
  max-width: 100px;
  max-height: 60px;
  width: auto;
  height: auto;
  border: 3px solid black;
  border-radius: 5px;
  background-color: white;
`;

  function Row(props) {
    const { row, index } = props;
    const [open, setOpen] = React.useState(false);
    const isItemSelected = isSelected(row.name);
    const labelId = `enhanced-table-checkbox-${index}`;
    const [logoFile, setLogoFile] = useState(undefined)
    const [logoPreview, setLogoPreview] = useState(null);
    const [showEdit, setEdit] = useState(false);
    const [showLinkFusion, setShowLink] = useState(false);
    const [newDomainData, setNewData] = useState({
      max_users: row?.max_users,
      color: row?.color,
    })
    const [newFusionDomain, setFusionDomain] = useState({
    })
    const handleChange = (e) => {
      // Vérifie si la valeur est un objet (ce qui signifie que c'est une couleur)
      if (e?.target?.name === "logo") {
        setLogoPreview(URL.createObjectURL(e.target.files[0]));
        setLogoFile(e.target.files[0]);
      } else if (typeof e === "string") {
        setNewData({ ...newDomainData, ["color"]: e });
      } else {
        setNewData({ ...newDomainData, [e.target.name]: e.target.value });
      }
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
      const confirmed = await openDialogue({
        message: newDomainData?.fusionUuid ? `Etes-vous sur(e) de vouloir linker ce domain locale au domain fusion: ${fusionDomains[newDomainData?.fusionUuid]}` : "Etes-vous sur(e) de vouloir modifier ce domaine?",
      });
      if (confirmed !== undefined && confirmed) {
        updateCRMData(`domains/updateDomainBack/${row?.uuid}`, newDomainData?.fusionUuid ? { ...newDomainData, fusionName: fusionDomains[newDomainData?.fusionUuid], linkingDomain: true } : newDomainData).then(res => {
          console.log(res)
          if (logoFile !== undefined) {
            updateCRMData(`domains/updateDomainLogoBack/${row?.uuid}`, { logo: logoFile }, { contentType: 'multipart/form-data' }).then((result) => {
              console.log(result)
              updateDomains()
            }).catch((err) => {
              console.log(err);
              setLoading(false);
            })
          } else {
            updateDomains()
            setLoading(false)
          }
        }).catch(err => {
          console.log(err)
          if (logoFile !== undefined) {
            updateCRMData(`domains/updateDomainLogoBack/${row?.uuid}`, { logo: logoFile }, { contentType: 'multipart/form-data' }).then((result) => {
              console.log(result)
              updateDomains()
            }).catch((err) => {
              console.log(err);
              setAlert({ title: "Domain creation failed.", text: err?.data, type: "danger" })
              setLoading(false);
            })
          } else {
            updateDomains()
            setLoading(false)
          }
          setLoading(false)
        })
      }
    }

    const handleDomainUnlink = async (e) => {
      e.preventDefault()
      const confirmed = await openDialogue({
        message: `Etes-vous sur(e) de vouloir delier le domain locale: ${row?.name} du domain fusion: ${unfilteredDomains[row?.fusionUuid]}. Les utilisateurs de ce domain n'auront plus acces ni a leurs lignes, ni a leur donnees telephonique dans leur interface!`,
      });
      if (confirmed !== undefined && confirmed) {
        updateCRMData(`domains/updateDomainBack/${row?.uuid}`, { fusionName: null, fusionUuid: null }).then(res => {
          console.log(res)
          if (logoFile !== undefined) {
            updateCRMData(`domains/updateDomainLogoBack/${row?.uuid}`, { logo: logoFile }, { contentType: 'multipart/form-data' }).then((result) => {
              console.log(result)
              updateDomains()
            }).catch((err) => {
              console.log(err);
              setLoading(false);
            })
          } else {
            updateDomains()
            setLoading(false)
          }
        }).catch(err => {
          console.log(err)
          setAlert({ title: "Domain dissociation failed.", text: err?.data, type: "danger" })
          setLoading(false)
        })
      }
    }

    async function deleteDomain(uuid) {
      const confirmed = await openDialogue({
        message: "Etes-vous sur(e) de vouloir supprimer ce domaine?",
      });

      if (confirmed !== undefined && confirmed) {
        await deleteCRMData("domains/deleteDomainBack", uuid).then(r => {
          updateDomains()
          console.log(r)
        }).catch(err => {
          console.log(err)
        })
      }
    }

    async function blockDomain(uuid, blocked) {
      const confirmed = await openDialogue({
        message: `Etes-vous sur(e) de vouloir ${blocked ? "de" : ""}bloquer ce domaine?`,
      });

      if (confirmed !== undefined && confirmed) {
        let newState = !blocked
        await updateCRMData(`domains/updateDomainBack/${uuid}`, { blocked: newState }).then(r => {
          updateDomains()
          console.log(r)
        }).catch(err => {
          console.log(err)
        })
      }
    }

    const handleConnection = async (domain) => {
      const token = sessionStorage.getItem("token") !== null
        ? sessionStorage.getItem("token")
        : false;
      const tokenRaw = jwt(token)
      let exp = moment.unix(tokenRaw?.exp)// Make a copy of data object.
      if (exp.isBefore(moment())) {
        alert("Token non valide. Reconnection requise.");
        await logout().then(res => {
          navigate("/")
        })
      } else {
        let frontUrl = process.env.REACT_APP_FRONT_BASIC
        window.open(`http${domain?.name.includes("localhost") ? "s" : ""}://${domain?.name?.split(".")[0]}.${frontUrl[frontUrl.length - 1] === "/" ? frontUrl : frontUrl + "/"}back-login/${domain?.uuid}/${JSON.parse(token)?.access_token}`);
      }
    };

    async function resendInviteLink(row) {
      const confirmed = await openDialogue({
        message: `Etes-vous sur(e) de vouloir renvoyer un email d'invitation a l'administrateur du domain: ${row?.name}?`,
      });

      if (confirmed !== undefined && confirmed) {
        await getCRMData(`users/resendInviteLinkBack/${row?.admin_email}`).then(r => {
          console.log(r)
        }).catch(err => {
          console.log(err)
        })
      }
    }

    let fieldWidth = "90%";
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open)
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            id={labelId}
            scope="row"
            padding="none"
          >
            {row.name}
          </TableCell>
          <TableCell align="left">{row.fusionName ?? "CRM Only"}</TableCell>
          <TableCell align="left">{row.blocked ? "Yes" : "No"}</TableCell>
          <TableCell align="left">{row.user_count}</TableCell>
          <TableCell align="left">{row.max_users}</TableCell>
          <TableCell align="left">{row.admin_email}</TableCell>
          <TableCell align="left">{row.logo !== null ? <img style={{ maxHeight: "50px" }}
            src={`${process.env.REACT_APP_CRM_BASE}${row.logo?.replace(/\\/g, "/")}`} /> : <></>}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{
            paddingBottom: 0,
            paddingTop: 0
          }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {showLinkFusion ? <Box sx={{
                display: "flex",
                justifyContent: "center",
                columnGap: "20px",
                margin: "20px 0",
                alignItems: "center"
              }}>
                <Select
                  labelId="select-fusion-domain"
                  id="fusion-domain"
                  value={newDomainData?.fusionUuid}
                  label="Fusion Domain to link"
                  sx={{
                    "& span": {
                      opacity: "1!important"
                    },
                    "& legend": {
                      height: "max-content"
                    }
                  }}
                  style={{
                    width: "-webkit-fill-available",
                    maxWidth: "40%"
                  }}
                  onChange={(e) => {
                    e.target.name = "fusionUuid"
                    handleChange(e)
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(fusionDomains).map(domainUuid => {
                    let domainName = fusionDomains[domainUuid]
                    return <MenuItem value={domainUuid} key={domainName}>{domainName}</MenuItem>
                  })}
                </Select>
                <Button variant="contained" style={{ minWidth: "120px" }}
                  onClick={handleSubmit}>Save</Button>
              </Box> : <></>}
              {showEdit ? <Box sx={{
                display: "flex",
                justifyContent: "center",
                columnGap: "20px",
                margin: "20px 0",
                alignItems: "center"
              }}>
                <StyledTextField
                  style={{ width: fieldWidth, margin: "5px" }}
                  name="max_users"
                  type="number"
                  label="Nb Maximum d'utilisateurs"
                  variant="outlined"
                  value={newDomainData.max_users}
                  onChange={handleChange}
                />
                <StyledTextField
                  style={{ width: fieldWidth, margin: "5px" }}
                  name="logo"
                  accept="image/*"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  label="Domain Logo"
                  onChange={handleChange}
                />
                {logoPreview && <ImagePreview src={logoPreview} alt="Logo preview" />}
                <ColorPickerContainer className={"color-picker-container"}>
                  <StyledColorPicker
                    name='color'
                    defaultValue='#000'
                    style={{ width: fieldWidth, margin: "5px" }}
                    variant="outlined"
                    label="Code couleur domaine"
                    value={newDomainData.color !== null ? newDomainData.color : ""}
                    InputProps={{ value: newDomainData.color }}
                    onChange={color => setNewData({ ...newDomainData, color })}
                  />
                  <ColorDisplay color={newDomainData.color} />
                </ColorPickerContainer>
                <Button variant="contained" style={{ minWidth: "120px" }}
                  onClick={handleSubmit}>Save</Button>
              </Box> : <></>}
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                columnGap: "20px",
                margin: "20px 0"
              }}>
                <Button variant="contained" onClick={() => {
                  blockDomain(row?.uuid, row?.blocked)
                }}>{row?.blocked ? "Unblock" : "Block"}</Button>
                <Button variant="contained" onClick={() => setEdit(!showEdit)}>{!showEdit ? "Edit" : "Close"}</Button>
                {!row?.fusionUuid ? <Button variant="contained" onClick={() => setShowLink(!showLinkFusion)}>{!showLinkFusion ? "Link to fusion" : "Close"}</Button> : <Button variant="contained" onClick={handleDomainUnlink}>{!showLinkFusion ? "Unlink from fusion" : "Close"}</Button>}
                <Button variant="contained" onClick={() => {
                  handleConnection(row)
                }}>Connect as Admin</Button>
                <Button variant="contained" onClick={() => {
                  resendInviteLink(row)
                }}>Resend invite link to admin</Button>
                <Button variant="contained" onClick={() => {
                  deleteDomain(row?.uuid)
                }}>Delete</Button>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  function EnhancedTable(rows) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
      () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, rows],
    );


    return (
      <>{visibleRows.length < 1 || isLoading ? <></> :
        <TableContainer component={Paper} style={{ maxHeight: "68vh", display: "grid" }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750, overflow: "auto" }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => (
                <Row key={row.name} row={row} index={index} />
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>}
        <TablePagination
          style={{ color: "white" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  }
  return EnhancedTable(rows)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Domain List</strong>
          </CCardHeader>
          <CCardBody>{EnhancedTable(rows)}
            {/* <DocsExample href="components/table#hoverable-rows">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Mark</CTableDataCell>
                      <CTableDataCell>Otto</CTableDataCell>
                      <CTableDataCell>@mdo</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Jacob</CTableDataCell>
                      <CTableDataCell>Thornton</CTableDataCell>
                      <CTableDataCell>@fat</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
                      <CTableDataCell>@twitter</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Accordion
