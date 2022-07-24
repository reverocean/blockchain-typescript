import {Block} from './Block'
import * as CryptoJS from "crypto-js"

class Blockchain {
  private static genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', '', 1465154705, 'my genesis block!!'
  )
  public readonly blockchainBlocks: Block[] = [Blockchain.genesisBlock]

  constructor(blockchainBlocks: Block[]) {
    this.blockchainBlocks = blockchainBlocks;
  }


  public isValidChain(): boolean {
    const blockchainToValidate: Block[] = this.blockchainBlocks
    let block: Block = blockchainToValidate[0];
    if (!this.isValidGenesis(block)) {
      return false
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
      if (!this.isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
        return false
      }
    }

    return true
  }

  public isValidGenesis(block: Block): boolean {
    return JSON.stringify(block) === JSON.stringify(Blockchain.genesisBlock)
  }

  public isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index')
      return false
    }

    if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previous hash')
      return false
    }

    if (this.calculateBlockHash(newBlock) !== newBlock.hash) {
      console.log('invalid this block hash')
      return false
    }
    return true
  }

  public isValidBlockStructure(newBlock: Block): boolean {
    return typeof newBlock.index === 'number'
      && typeof newBlock.hash === 'string'
      && typeof newBlock.previousHash === 'string'
      && typeof newBlock.timestamp === 'number'
      && typeof newBlock.data === 'string'
  }

  public isDeeperThan(blockChain: Blockchain): boolean {
    return blockChain.blockchainBlocks.length > this.blockchainBlocks.length
  }

  calculateHash(index: number, previousHash: string, timestamp: number, data: string): string {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString()
  }

  getLatestBlock(): Block {
    return this.blockchainBlocks[this.blockchainBlocks.length - 1];
  }

  private calculateBlockHash(newBlock: Block) {
    return this.calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data)
  }
}

export {
  Blockchain
}