import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/entities/User';

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    	id!: number;

    @Column()
    	name!: string;

    @Column()
    	url!: string;

    @ManyToOne(() => User, user => user.photos)
    @JoinColumn({ name: 'user_id' })
    	user!: User;

    @CreateDateColumn()
    	createdAt!: Date;

    @UpdateDateColumn()
    	updatedAt!: Date;
}
