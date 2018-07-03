import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Scene } from "../typings/graphql";

@Entity("scenes")
export class SceneEntity implements Scene {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  public title?: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  public details?: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  public url?: string;

  @Column({
    nullable: true,
    type: "tinyint",
  })
  public rating?: number;

  @Column({
    type: "varchar",
    unique: true,
  })
  public path: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  public checksum: string;

  @Column({
    type: "varchar",
  })
  public size: string;

  @Column({
    precision: 7,
    scale: 2,
  })
  public duration: number;

  @Column({
    type: "varchar",
  })
  public videoCodec: string;

  @Column({
    type: "varchar",
  })
  public audioCodec: string;

  @Column({
    type: "tinyint",
  })
  public width: number;

  @Column({
    type: "tinyint",
  })
  public height: number;

  // @ManyToOne(type => StudioEntity, studio => studio.scenes)
  // studio: StudioEntity;

}
