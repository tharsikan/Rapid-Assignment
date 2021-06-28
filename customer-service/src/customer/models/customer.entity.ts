import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  car_make: string;

  @Column()
  car_model: string;

  @Column()
  vin_number: string;

  @Column()
  manufactured_date: string;

  @Column()
  age: number;
}
