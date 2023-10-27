import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '@/entities/User';
import { Photo } from '@/entities/Photo';


@Entity()
export class Client extends User {
    @Column({
    	type: 'varchar',
    })
    	avatar!: string;

    @OneToMany(() => Photo, photo => photo.client, { cascade: true })
	    photos!: Photo[]
}