import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Scene } from "../typings/graphql";

@Entity("scenes")
export class SceneEntity implements Scene {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  rating: number;

}