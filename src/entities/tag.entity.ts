import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tags")
export class TagEntity {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

}
