import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name : 'reviews'})
export class Review {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    ratings : number;

    @Column()
    comment : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @ManyToOne(()=>User ,(user)=>user.reviews)
    user : User;

    @ManyToOne(()=> Product, (product)=>product.reviews)
    product :Product;
}
