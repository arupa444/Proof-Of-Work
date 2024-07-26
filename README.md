# Proof of Work Implementation in JavaScript

This project demonstrates a simple implementation of the Proof of Work (PoW) algorithm used in the Bitcoin blockchain. It is written in JavaScript and simulates the mining process by finding a valid nonce for a given block header.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [Contributing](#contributing)


## Introduction

Proof of Work (PoW) is a consensus mechanism used in blockchain networks like Bitcoin. This project implements PoW to demonstrate how the mining process works, including constructing block headers, calculating target values, and validating hashes.

## Features

- Converts hexadecimal to decimal
- Constructs block headers
- Calculates target values based on difficulty
- Validates hashes against target values

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/arupa444/proof-of-work-js.git
    cd proof-of-work-js
    ```
2. Install the necessary dependencies:
    ```bash
    npm install
    ```

## Usage

Run the script using Node.js:

node pow.js

## Code Explanation

The main class `POW` includes the following methods:


- `hTod(x)`: Converts hexadecimal to decimal.
- `hexaabcdef(x)`: Converts hexadecimal characters to their decimal equivalents.
- `theKey()`: Constructs the block header.
- `target()`: Calculates the target value based on the difficulty.
- `isValidHash(hash, target)`: Validates the hash against the target value.
- `theComparatorForMiner(header, target)`: Mines by iterating through possible nonces to find a valid hash.
- `sha256(data)`: Computes the SHA-256 hash of the given data.

code Usage:

```bash
const version = 0x20000000;
const prevBlockHash = '0000000000000000000769c0f55d1ed7d45b8c7b94e6780a6f8e1b682a35c427';
const merkleRoot = '7f8c0b6467e7c6465c8f8b1e5b94707e9c8b2c2d6182d8b1e9d8b2d1d2c7c827';
const timestamp = 0x5d14a0b4;
const difficultyTarget = 0x1d00ffff;

let SHA256 = new POW(version, prevBlockHash, merkleRoot, timestamp, difficultyTarget);
let header = SHA256.theKey();
let target = SHA256.target();
const result = SHA256.theComparatorForMiner(header, target);

if (result) {
    console.log(`Valid nonce found: ${result.nonce}`);
    console.log(`Hash: ${result.hashResult}`);
} else {
    console.log('No valid nonce found.');
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.




