const Block = require('./block');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];//As the blockchain is only created once.
    }

    addBlock(data){

        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);
        


        return block;
    }

    isValidChain(chain) {
        console.log('Starting chain validation...');
        
        // Check genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            console.error('Genesis block validation failed');
            return false;
        }
        
        // Check rest of the chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
    
            if (block.lastHash !== lastBlock.hash || 
                block.hash !== Block.blockHash(block)) {
                console.error(`Block ${i} validation failed`);
                return false;
            }
        }
    
        console.log('Chain validation successful');
        return true;
    }
    

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log("Recieved chain is not longer than the current chain");
            return false;
        }

        else if(this.isValidChain(newChain) === false){
            console.log("The received  chain is not valid");
            return false;
        }
        else{
            this.chain = newChain;
            console.log("Replacing blockchain with new chain");
            return true;
        }




    }
}


module.exports = Blockchain;

/*NOTE: THe reason we are using JSON.stringify only for the genesis block is because that
block is manually created and has to have exactly the same properties. The later blocks
are being dynamically generated based on their predecessors. The motivation is that we are
just making sure that the blockchain remains linked for the new ones. */