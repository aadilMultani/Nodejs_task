import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";
import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column()
    role: string; // "Admin" or "Staff"

    @Column()
    @IsOptional()
    @IsString()
    phone: string;

    @Column()
    @IsOptional()
    @IsString()
    city: string;

    @Column()
    @IsOptional()
    @IsString()
    country: string;
}