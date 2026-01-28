import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status-enum";
import { User } from "src/users/entities/user.entity";
import { Shipping } from "./shipping.entity";
import { OrdersProducts } from "./orders-products.entity";


@Entity({name : 'orders'})
export class Order {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'enum', enum : OrderStatus,default : OrderStatus.PROCESSING})
    status : string;

    @Column({nullable : true})
    shippedAt : Date;

    @Column({nullable : true})
    deliveredAt : Date;

    @CreateDateColumn()
    orderAt : Date;


    @ManyToOne(()=>User, (user)=>user.ordersUpdatedBy)
    updatedBy : User;

    @OneToOne(()=> Shipping, (ship) => ship.order ,{cascade : true})
    @JoinColumn()
    shippingAddress : Shipping;

    @OneToMany(()=> OrdersProducts,(orderProduct)=> orderProduct.order,{cascade : true})
    products : OrdersProducts[];

    @ManyToOne(()=> User , (user)=> user.orders)
    user:User;


}
