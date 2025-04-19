import readline from 'readline'
import { prisma } from '@/lib/prisma'

export async function SEARCH() {
  try {

      const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    // Ask the question
    const userInput = await new Promise((resolve) => {
      rl.question('Enter a keyword to search: ', (answer) => {
        rl.close()
        resolve(answer)
      })
    })

    // Search using Prisma (unsure if FoodItem is the right term to call here or the one in schema structure)
    results = await prisma.FoodItem.findMany({
      where: {
        OR: [
          //This will probably only work if the input is the full name of the shop.
          //Adding stuff like showing suggestions based on incomplete words gon be somethin to work on some other time
          { name: { contains: userInput, mode: 'insensitive' } },
        ]
      },
      select: {
        name: true,
      }
    })

    //Printing out the results of whatever fit the name
    //This is probably the least efficient way to do this since i dont know how to put them all in one array
    //So I copy and pasted the same code thrice
    console.log('Search results:')
    results.forEach(item => {
      console.log(`- ${item.name}`)
    })

    results = await prisma.LeisureItem.findMany({
      where: {
        OR: [
          { name: { contains: userInput, mode: 'insensitive' } },
        ]
      },
      select: {
        name: true,
      }
    })

    console.log('Search results:')
    results.forEach(item => {
      console.log(`- ${item.name}`)
    })

    results = await prisma.ServiceItem.findMany({
      where: {
        OR: [
          { name: { contains: userInput, mode: 'insensitive' } },
        ]
      },
      select: {
        name: true,
      }
    })

    console.log('Search results:')
    results.forEach(item => {
      console.log(`- ${item.name}`)
    })

    if (!results) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Error: Item Not Found", error)
    return NextResponse.json({ error: "Failed to fetch item", details: error.message }, { status: 500 })
  }
}