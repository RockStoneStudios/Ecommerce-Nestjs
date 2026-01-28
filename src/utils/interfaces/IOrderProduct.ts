import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";



export interface IOrderProduct {
    order : Order;
    product : Product;
    product_quantity : number;
    product_unit_price : number;
}