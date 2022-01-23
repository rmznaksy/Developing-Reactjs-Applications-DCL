let square = function * (numbers) {
    for (let number of numbers) {
            console.log(`square(${number})`)
            yield number*number;
    }
}

let get_odds = function * (numbers) {
    for (let number of numbers) {
        console.log(`get_odds(${number})`)
        if (number % 2 === 1)
            yield number;
    }
}
let rakamlar = [4, 8, 15, 16, 23, 42];

for (let rakam of square(get_odds(rakamlar)))
    console.log(`for loop: ${rakam}`)







