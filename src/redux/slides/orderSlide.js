import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  isErrorOrder: false,
  isSuccsessOrder: false,
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const orderItem = action.payload.orderItem;
      const existingItemIndex = state.orderItems.findIndex(
        (item) => item.product === orderItem.product
      );

      if (existingItemIndex !== -1) {
        if (
          state.orderItems[existingItemIndex].amount <=
          state.orderItems[existingItemIndex].countInStock
        ) {
          state.orderItems[existingItemIndex].amount += orderItem.amount;
          state.isErrorOrder = false;
        } else {
          state.isErrorOrder = true;
        }
      } else {
        state.orderItems.push(orderItem);
      }
    },
    increaseAmount: (state, action) => {
      const idProduct = action.payload.idProduct;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      const itemOrderSelected = state.orderItemsSelected.find(
        (item) => item.product === idProduct
      );
      if (itemOrder) {
        itemOrder.amount++;
      }
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const idProduct = action.payload.idProduct;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      const itemOrderSelected = state.orderItemsSelected.find(
        (item) => item.product === idProduct
      );
      if (itemOrder) {
        itemOrder.amount--;
      }
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const idProduct = action.payload.idProduct;
      const itemOrder = state.orderItems.filter(
        (item) => item.product !== idProduct
      );
      const itemOrderSelected = state.orderItemsSelected.filter(
        (item) => item.product !== idProduct
      );

      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSelected;
    },
    removeAllProduct: (state, action) => {
      const { listChecked } = action.payload;
      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const itemOrderSelected = state?.orderItemsSelected?.filter(
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = itemOrders;
      state.orderItemsSelected = itemOrderSelected;
    },

    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;

      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSelected = orderSelected;
    },
  },
});

export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllProduct,
  selectedOrder,
} = orderSlide.actions;

export default orderSlide.reducer;
