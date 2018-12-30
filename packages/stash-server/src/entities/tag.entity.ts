import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "../typings/graphql";

@Entity("tags")
export class TagEntity implements Tag {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

}
