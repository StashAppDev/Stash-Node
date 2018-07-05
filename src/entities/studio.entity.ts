import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SceneEntity } from "./scene.entity";

@Entity("studios")
export class StudioEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: "blob" })
  public image: string;

  @Column({ type: "varchar", unique: true })
  public checksum: string;

  @Column({ type: "varchar", nullable: true })
  public name?: string | null;

  @Column({ type: "varchar", nullable: true })
  public url?: string | null;

  @OneToMany((type) => SceneEntity, (scene) => scene.studio)
  public scenes: SceneEntity[];
}
