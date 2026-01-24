import { Expose } from "class-transformer";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name : 'categories'})
export class Category {

    @PrimaryGeneratedColumn()
    @Expose()
    id : number;

    @Column()
    title: string;
    
    @Column()
    description : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @ManyToOne(() => User, (user)=> user.categories)
    addedBy : User;

    @OneToMany(()=> Product, (product) => product.category)
    products : Product[];


}
