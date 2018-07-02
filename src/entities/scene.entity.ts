import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Scene } from "../typings/graphql";

@Entity("scenes")
export class SceneEntity implements Scene {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  details: string;

  @Column()
  url: string;

  @Column()
  rating: number;

  @Column()
  path: string;

  @Column()
  checksum: string;

  @Column()
  size: string;

  @Column()
  duration: number;

}