import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/entities/User';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    	id!: number;

    @Column({
    	type: 'varchar',
    })
    	avatar!: string;

    @OneToOne(() => User, { cascade: true })
	@JoinColumn({ name: 'user_id' })
    	user!: User;

    @CreateDateColumn({
    	type: 'timestamp',
    	name: 'created_at',
    })
    	createdAt!: Date;

    @UpdateDateColumn({
    	type: 'timestamp',
    	name: 'updated_at',
    })
    	updatedAt!: Date;
}