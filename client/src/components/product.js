class Product{
    #name;
    #description; 
    #price;
    #amount;
    #category

    constructor(n,d,p,c){
        this.#name = n;
        this.#description  = d;
        this.#price = p;
        this.#amount = 0; 
        this.#category = c; 
    }
    
    get name() {return this.#name;}
    get description() {return this.#description;}
    get price() {return this.#price;}
    get amount() {return this.#amount;}
    get category() {return this.#category;}
    /**
     * @param {number} val
     */
    set amount(val) {this.#amount = val;}

}


export default Product;