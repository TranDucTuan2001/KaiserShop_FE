import { axiosJWT } from "./UserService";

export const createOrder = async (id, data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${id}`,data,{
      headers:{
        token:`Bearer ${access_token}`
      }
    });
    return res.data;
  };

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`,{
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsOrder = async (id,orderId,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}&${orderId}`,{
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const cancelsOrder = async (access_token, orderId, id, orderItems) => {
  // console.log("Token sent:", access_token); 
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}&${orderId}`, {
    data: orderItems , 
    headers: {
      token: `Bearer ${access_token}`, 
    },
  });
  return res.data;
};


export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-orders`,{
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrder = async (id,data,access_token) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`,data,{
    headers:{
      token:`Bearer ${access_token}`
    }
  });
  return res.data;

};

export const deleteOrder = async (id,access_token) => {
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${id}`,{
    headers:{
      token:`Bearer ${access_token}`
    }
  });
  return res.data;
};

export const deleteManyOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/delete-many`,data,{
    headers:{
      token:`Bearer ${access_token}`
    }
  });
  return res.data;
};