const crypto = require('crypto');


class POW {
    constructor(version, previousBlockHash, merkleRoot, timeStamp, difficultyTarget){
        this.version = version;
        this.previousBlockHash = previousBlockHash;
        this.merkleRoot = merkleRoot;
        this.timeStamp = timeStamp;
        this.difficultyTarget = difficultyTarget;
    }
    hTod(x){
        let b='';
        let p=0;
        let hexS=0;
        let res=0;
        while(x!=''){
            b=x[x.length-1];
            x=x.slice(0,-1);
            if(b >= 'a' && b<='z' || b >= 'A' && b<='Z' ){
                hexS=this.hexaabcdef(b);
            }else{
                hexS=Number(b)
            }
            res+=Math.pow(16,p)*hexS;
            p+=1;
        }
        return res;
    }
    hexaabcdef(x){
        if(x=='a' || x=='A'){
            return 10;
        }else if(x=='b' || x=='B'){
            return 11;
        }else if(x=='c' || x=='C'){
            return 12;
        }else if(x=='d' || x=='D'){
            return 13;
        }else if(x=='e' || x=='E'){
            return 14;
        }else if(x=='f' || x=='F'){
            return 15;
        }else{
            try{
                throw new TypeError("Not an perfect output for this function"); 
            }catch(err){
                console.log(err);
                console.log("Arupa spoke!! : Enter The Details Again!!");
            }
        }
    }
    theKey(){
        const blockHeader = Buffer.alloc(80);// header is of 80bytes so...

        blockHeader.writeUInt32LE(this.version,0); // 4byte!!

        Buffer.from(this.previousBlockHash,'hex').reverse().copy(blockHeader,4); //32 bytes!!  as version takes 4bytes so... and as we know we have to reverse the previous block header so...

        Buffer.from(this.merkleRoot,'hex').reverse().copy(blockHeader,36); //32 bytes!! as preBlock is 32 so 32+4=36...

        blockHeader.writeUInt32LE(this.timeStamp,68);// 4bytes!! as merkleRoot carries 32bytes so 36+32=68...

        blockHeader.writeUInt32LE(this.difficultyTarget,72);// 4bytes!!

        return blockHeader;
    }
    target(){
        let targetEle = "";
        let firstTwoEle = "";
        let exp = 0;
        let coefficientEle= "";
        let targetValue=0;
        targetEle = this.difficultyTarget.toString(16);
        firstTwoEle=targetEle.slice(0,2); // slicing first two elements to use that in making exponent for the target element

        firstTwoEle=Number(this.hTod(firstTwoEle));
        coefficientEle=targetEle.slice(2,targetEle.length); // excluding the first two element to get Coefficient

        exp=8*(firstTwoEle-3);
        targetValue= BigInt(this.hTod(coefficientEle)) * BigInt(Math.pow(2,exp));

        return targetValue;
    }
    isValidHash(hash, target) {
        const hashBuffer = Buffer.from(hash, 'hex');
        const hashInt = BigInt('0x' + hashBuffer.reverse().toString('hex')); // Reverse byte order for comparison
        return hashInt <= target;
    }
    theComparatorForMiner(header, target) {
        const maxNonce = 2 ** 32; // 32-bit nonce range
    
        for (let nonce = 0; nonce < maxNonce; nonce++) {
            const nonceBuffer = Buffer.alloc(4);
            nonceBuffer.writeUInt32LE(nonce, 0);
            const headerWithNonce = Buffer.concat([header, nonceBuffer]);
            const hashResult = this.sha256(this.sha256(headerWithNonce));
            console.log(hashResult);
            
            if (this.isValidHash(hashResult, target)) {
                return { nonce, hashResult: hashResult.toString('hex') };  // Valid hash found
            }
        }
        return null;  // No valid hash found in the 
    }
    sha256(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

const version = 0x20000000;
const prevBlockHash = '0000000000000000000769c0f55d1ed7d45b8c7b94e6780a6f8e1b682a35c427';
const merkleRoot = '7f8c0b6467e7c6465c8f8b1e5b94707e9c8b2c2d6182d8b1e9d8b2d1d2c7c827';
const timestamp = 0x5d14a0b4;
const difficultyTarget = 0x1d00ffff;

let SHA256= new POW(version,prevBlockHash,merkleRoot,timestamp,difficultyTarget);

let header=SHA256.theKey();
let target=SHA256.target();
const result=SHA256.theComparatorForMiner(header,target);

if (result) {
    console.log(`Valid nonce found: ${result.nonce}`);
    console.log(`Hash: ${result.hashResult}`);
} else {
    console.log('No valid nonce found.');
}
