let get_lottery_numbers = async function(max=60,size=6){
    if (max<=size) throw "max should be larger than size";
    let numbers= [];
    while (numbers.length<size){
        let number = Math.floor(Math.random() * max ) + 1;
        if (!numbers.includes(number))
            numbers.push(number);
    }
    numbers.sort((u,v) => u-v);
    return numbers;
}
let fun = function(max,size){
    return new Promise( (resolve,reject) => {
        if (max<=size) reject("max should be larger than size");
        let numbers= [];
        while (numbers.length<size){
            let number = Math.floor(Math.random() * max ) + 1;
            if (!numbers.includes(number))
                numbers.push(number);
        }
        numbers.sort((u,v) => u-v);
        resolve(numbers);
    });
}

get_lottery_numbers(6,6).then( console.log )
                                .catch( console.error )

let gun = async () => {
    let numbers = await get_lottery_numbers();
    console.log(numbers);
}

gun();







