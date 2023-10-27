import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Client } from '@/entities/Client';

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    	id!: number;

    @Column()
    	name!: string;

    @Column()
    	url!: string;

    @ManyToOne(() => Client, client => client.photos)
    	client!: Client;

    @CreateDateColumn()
    	createdAt!: Date;

    @UpdateDateColumn()
    	updatedAt!: Date;
}
