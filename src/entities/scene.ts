import {Column, Entity, PrimaryColumn, Generated} from "typeorm";

@Entity("scenes")
export class Scene {

    @PrimaryColumn("integer")
    @Generated()
    id: number;

    @Column()
    title: string;

}