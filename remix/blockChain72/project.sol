pragma solidity ^0.8.26;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract EnergyTradingith72 {
    // Energy token structure
    struct EnergyToken {
        address seller;
        uint256 amount;  // Amount of energy in kWh
        uint256 price;   // Price per kWh in Wei (smallest Ether unit)
        bool isAvailable;
    }

    // Mapping for keeping track of users' energy tokens
    mapping(address => uint256) public balances;
    

    // List of all energy tokens for sale
    EnergyToken[] public energyTokensForSale;
    
    // Event to notify when energy is listed for sale
    event EnergyListed(address seller, uint256 amount, uint256 price);
    
    // Event to notify when energy is bought
    event EnergyBought(address buyer, address seller, uint256 amount, uint256 totalCost);
    
    // Function to list energy for sale
    function listEnergy(uint256 amount, uint256 pricePerKWh) public {
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerKWh > 0, "Price per kWh must be greater than 0");

        // Create a new energy token
        EnergyToken memory token = EnergyToken({
            seller: msg.sender,
            amount: amount,
            price: pricePerKWh,
            isAvailable: true
        });

        // Add the energy token to the list of tokens for sale
        energyTokensForSale.push(token);

        emit EnergyListed(msg.sender, amount, pricePerKWh);

        // Log the updated list (for debugging in Remix)
        logEnergyListings();
    }

    // Function to buy energy tokens
    function buyEnergy(uint256 tokenId, uint256 amount) public payable {
        require(tokenId < energyTokensForSale.length, "Invalid token ID");
        EnergyToken storage token = energyTokensForSale[tokenId];
        amount =100;
        require(token.isAvailable, "Energy not available");
        require(amount > 0 && amount <= token.amount, "Invalid amount");

        // Calculate the total cost in Wei (Ether)
        uint256 totalCost = token.price * amount;
        require(msg.value >= totalCost, "Not enough Ether sent");

        // Transfer the energy tokens from seller to buyer
        balances[msg.sender] += amount;
        token.amount -= amount;

        // If all energy is sold, mark the token as unavailable
        if (token.amount == 0) {
            token.isAvailable = false;
        }

        // Transfer Ether to the seller
        payable(token.seller).transfer(totalCost);

        emit EnergyBought(msg.sender, token.seller, amount, totalCost);

        // Log the updated list (for debugging in Remix)
        logEnergyListings(); 
    }

    // Function to get the list of all energy tokens available for sale
    function getEnergyTokensForSale() public view returns (EnergyToken[] memory) {
        return energyTokensForSale;
    }

    // Helper function to log the current energy listings (for debugging in Remix)
    function logEnergyListings() internal view {
        for (uint256 i = 0; i < energyTokensForSale.length; i++) {
            EnergyToken memory token = energyTokensForSale[i];
            console.log("Token ID:", i);
            console.log("Seller:", token.seller);
            console.log("Amount:", token.amount, "kWh");
            console.log("Price:", token.price, "Wei");
            console.log("Available:", token.isAvailable);
            console.log("--------------------");
        }
    }
}