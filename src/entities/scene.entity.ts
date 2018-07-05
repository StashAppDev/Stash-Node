import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudioEntity } from "./studio.entity";

@Entity("scenes")
export class SceneEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: "varchar", unique: true })
  public checksum: string;

  @Column({ type: "varchar", nullable: true })
  public title?: string;

  @Column({ type: "varchar", nullable: true })
  public details?: string;

  @Column({ type: "varchar", nullable: true })
  public url?: string;

  @Column({ type: "varchar", nullable: true })
  public date?: string;

  @Column({ type: "tinyint", nullable: true })
  public rating?: number;

  @Column({ type: "varchar", unique: true })
  public path: string;

  @Column({ type: "varchar" })
  public size: string;

  @Column({ precision: 7, scale: 2 })
  public duration: number;

  @Column({ type: "varchar" })
  public videoCodec: string;

  @Column({ type: "varchar" })
  public audioCodec: string;

  @Column({ type: "tinyint" })
  public width: number;

  @Column({ type: "tinyint" })
  public height: number;

  @ManyToOne((type) => StudioEntity, (studio) => studio.scenes)
  public studio: StudioEntity;

  // @OneToOne()
  // public gallery: GalleryEntity;
}
