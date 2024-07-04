require('dotenv').config(); // Add this line at the top

const { PrismaClient } =  require("@prisma/client");

const database = new PrismaClient()
async function main(){
    try {
        await database.category.createMany({
            data:[
        { name: "Programming" },
        { name: "Data Science" },
        { name: "Business" },
        { name: "Personal Development" },
        { name: "Design" },
        { name: "Marketing" },
        { name: "Health & Fitness" },
        { name: "Music" },
        { name: "Language Learning" },
        { name: "Finance & Accounting" },
        { name: "IT & Software" },
        { name: "Teaching & Academics" },
            ]
        })
        console.log("success")
    }catch(err){
        console.log('Error seeding the database categories',err)
    }finally{
        await database.$disconnect()
    }
}
main()