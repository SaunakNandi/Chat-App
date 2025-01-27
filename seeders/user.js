import { faker, simpleFaker } from '@faker-js/faker';
import { User } from '../models/user.models.js'

const createUser=async(numUsers)=>{
    try {
        const usersPromise=[]
        for(let i=0; i<numUsers; i++){
            usersPromise.push(User.create({
                name:faker.person.fullName(),
                username:faker.internet.username(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.avatar(),
                    public_id:faker.system.fileName()
                },
            }))
        }
        await Promise.all(usersPromise)
        console.log("Users created ",numUsers)
        process.exit(1); // for closing the server
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}




export {createUser}