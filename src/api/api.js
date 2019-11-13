import axios from 'axios';

let base1 = process.env.NODE_ENV === 'production'? '': '/api'
export const userLogin = params => { return axios.post(`${base1}/userLogin`, params).then(res =>  res.data); };
export const saveUser = params => { return axios.post(`${base1}/saveUser`, params).then(res =>  res.data); };
export const updateUser = params => { return axios.post(`${base1}/updateUser`, params).then(res =>  res.data); };
export const deleteUser = params => { return axios.post(`${base1}/deleteUser`, params).then(res =>  res.data); };
export const getUser = params => { return axios.get(`${base1}/getUser`, {params:params}).then(res =>  res.data); };
export const getAllUser = params => { return axios.get(`${base1}/getAllUser`, {params:params}).then(res =>  res.data); };
export const addEquipment = params => { return axios.post(`${base1}/addEquipment`, params).then(res =>  res.data); };
export const relevanceEquipment = params => { return axios.post(`${base1}/relevanceEquipment`, params).then(res =>  res.data); };
export const downToExcel = params => { return axios.post(`${base1}/downToExcel`, params).then(res =>  res.data); };

export const saveEquipment = params => { return axios.post(`${base1}/saveEquipment`, params).then(res =>  res.data); };
export const updateEquipment = params => { return axios.post(`${base1}/updateEquipment`, params).then(res =>  res.data); };
export const deleteEquipment = params => { return axios.post(`${base1}/deleteEquipment`, params).then(res =>  res.data); };
export const getEquipment = params => { return axios.get(`${base1}/getEquipment`, {params:params}).then(res =>  res.data); };
export const getEquipmentData = params => { return axios.get(`${base1}/getEquipmentData`, {params:params}).then(res =>  res.data); };
export const getAllEquipment = params => { return axios.get(`${base1}/getAllEquipment`, {params:params}).then(res =>  res.data); };

export const saveMenu = params => { return axios.post(`${base1}/saveMenu`, params).then(res =>  res.data); };
export const updateMenu = params => { return axios.post(`${base1}/updateMenu`, params).then(res =>  res.data); };
export const getAllMenu = params => { return axios.get(`${base1}/getAllMenu`, {params:params}).then(res =>  res.data); };
export const getAllMenuByPage = params => { return axios.get(`${base1}/getAllMenuByPage`, {params:params}).then(res =>  res.data); };
export const getAllMenuByUserId = params => { return axios.get(`${base1}/getAllMenuByUserId`, {params:params}).then(res =>  res.data); };


export const saveTwoLevelMenu = params => { return axios.post(`${base1}/saveTwoLevelMenu`, params).then(res =>  res.data); };
export const getAllTwoLevelMenuByMenuId = params => { return axios.get(`${base1}/getAllTwoLevelMenuByMenuId`, {params:params}).then(res =>  res.data); };
export const getAllTwoLevelMenu = params => { return axios.get(`${base1}/getAllTwoLevelMenu`, {params:params}).then(res =>  res.data); };
export const updateTwoLevelMenu = params => { return axios.post(`${base1}/updateTwoLevelMenu`, params).then(res =>  res.data); };
export const saveAssociatedDevice = params => { return axios.post(`${base1}/saveAssociatedDevice`, params).then(res =>  res.data); };
export const deleteAssociatedDevice = params => { return axios.post(`${base1}/deleteAssociatedDevice`, params).then(res =>  res.data); };
export const getAllEquipmentByTwoLevelMenuId = params => { return axios.get(`${base1}/getAllEquipmentByTwoLevelMenuId`, {params:params}).then(res =>  res.data); };

