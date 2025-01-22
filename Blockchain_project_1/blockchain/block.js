const SHA256 = require('crypto-js/sha256');
const {DIFFICULTY, MINE_RATE} = require('../config');


class Block{
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty|| DIFFICULTY;
    }

    toString(){
        return `Block-
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Nonce     : ${this.nonce}
            Data      : ${this.data}
            DIFFICULTY: ${this.difficulty};`
    }

    static genesis() {
        const timestamp = 'Genesis time';
        const lastHash = '----';
        const data = [];
        const nonce = 0;
        const difficulty = DIFFICULTY;
        const hash = this.hash(timestamp, lastHash, data, nonce, difficulty); // Dynamically calculate hash
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }
    

    static mineBlock(lastBlock, data) {
        /*To incooperate the POW mechanism, we have to create a nonce. Now, POW mechanism
        is only correct when we are able to generate a hash with leading 0's equal to the
        difficulty of the blockchain at that instance. If that is the case, till we get
        leading 0's in the hash value, we have to keep recomputing it. This means that 
        both the timestamp and  the hash values will keep changing. Nonce is the random 
        value that helps get the hash value.  */
        
        let hash, timestamp;
        let {difficulty} = lastBlock;
        const lastHash = lastBlock.hash;
        let nonce = 0;
    
        do {
            nonce++;
            timestamp = Date.now();
            // Update difficulty based on current timestamp
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            // Calculate hash with ALL parameters
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
        // Create new block with the exact same values used to generate the hash
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp , lastHash, data, nonce, difficulty){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const{timestamp, lastHash, data, nonce, difficulty} = block; 
        return Block.hash(timestamp, lastHash, data , nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp+MINE_RATE>currentTime? difficulty+1: difficulty-1;
        return difficulty;
    }
}

module.exports = Block;