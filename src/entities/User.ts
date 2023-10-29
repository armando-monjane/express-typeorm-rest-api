import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from '@/entities/UserRole'
export abstract class User {

    @PrimaryGeneratedColumn()
    	id!: number

    @Column({
    	type: 'varchar',
    	length: 25,
    })
    	firstName!: string

    @Column({
    	type: 'varchar',
    	length: 25,
    })
    	lastName!: string

    @Column({
    	type: 'varchar',
    	unique: true,
    })
    	email!: string

    @Column({
    	type: 'varchar',
    })
    	password!: string

    @Column({
    	type: 'enum',
    	enum: UserRole,
    	default: UserRole.CLIENT,
    })
    	role!: UserRole

    @Column({
    	type: 'boolean',
    	default: true,
    	name: 'active',
    })
    	isActive!: boolean

    @CreateDateColumn({
    	type: 'timestamp',
    	name: 'created_at',
    })
    	createdAt!: Date

    @UpdateDateColumn({
    	type: 'timestamp',
    	name: 'updated_at',
    })
    	updatedAt!: Date
}
