import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Scene } from "../typings/graphql";

@Entity("scenes")
export class SceneEntity implements Scene {

  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  title?: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  details?: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  url?: string;

  @Column({
    type: "tinyint",
    nullable: true
  })
  rating?: number;

  @Column({
    type: "varchar",
    unique: true
  })
  path: string;

  @Column({
    type: "varchar",
    unique: true
  })
  checksum: string;

  @Column({
    type: "varchar"
  })
  size: string;

  @Column({
    precision: 7,
    scale: 2
  })
  duration: number;

  @Column({
    type: "varchar"
  })
  videoCodec: string;

  @Column({
    type: "varchar"
  })
  audioCodec: string;

  @Column({
    type: "tinyint"
  })
  width: number;

  @Column({
    type: "tinyint"
  })
  height: number;

  // @ManyToOne(type => StudioEntity, studio => studio.scenes)
  // studio: StudioEntity;

}