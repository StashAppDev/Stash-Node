import {Column, Entity, PrimaryColumn, Generated} from "typeorm";

@Entity("tags")
export class Tag {

    @PrimaryColumn("integer")
    @Generated()
    id: number;

    @Column()
    name: string;

}